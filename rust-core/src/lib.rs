// SPDX-License-Identifier: MIT

//! Hardware-neutral planning and safety primitives for Embodied AI Mission Lab.

use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap, HashSet};

/// A discrete position in a two-dimensional mission grid.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

impl Position {
    pub const fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }

    fn manhattan_distance(self, other: Self) -> usize {
        self.x.abs_diff(other.x) as usize + self.y.abs_diff(other.y) as usize
    }
}

/// A rectangular mission grid with blocked cells.
#[derive(Debug, Clone)]
pub struct Grid {
    width: i32,
    height: i32,
    obstacles: HashSet<Position>,
}

impl Grid {
    /// Creates a grid and rejects invalid dimensions or out-of-bounds obstacles.
    pub fn new(
        width: i32,
        height: i32,
        obstacles: impl IntoIterator<Item = Position>,
    ) -> Result<Self, GridError> {
        if width <= 0 || height <= 0 {
            return Err(GridError::InvalidDimensions);
        }

        let obstacles = obstacles.into_iter().collect::<HashSet<_>>();
        if obstacles
            .iter()
            .any(|position| position.x < 0 || position.y < 0 || position.x >= width || position.y >= height)
        {
            return Err(GridError::ObstacleOutOfBounds);
        }

        Ok(Self {
            width,
            height,
            obstacles,
        })
    }

    pub fn width(&self) -> i32 {
        self.width
    }

    pub fn height(&self) -> i32 {
        self.height
    }

    pub fn is_in_bounds(&self, position: Position) -> bool {
        position.x >= 0
            && position.y >= 0
            && position.x < self.width
            && position.y < self.height
    }

    pub fn is_obstacle(&self, position: Position) -> bool {
        self.obstacles.contains(&position)
    }

    pub fn is_walkable(&self, position: Position) -> bool {
        self.is_in_bounds(position) && !self.is_obstacle(position)
    }

    fn neighbors(&self, position: Position) -> impl Iterator<Item = Position> + '_ {
        [
            Position::new(position.x + 1, position.y),
            Position::new(position.x - 1, position.y),
            Position::new(position.x, position.y + 1),
            Position::new(position.x, position.y - 1),
        ]
        .into_iter()
        .filter(|candidate| self.is_walkable(*candidate))
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GridError {
    InvalidDimensions,
    ObstacleOutOfBounds,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PlanError {
    StartOutOfBounds,
    GoalOutOfBounds,
    StartBlocked,
    GoalBlocked,
    NoPath,
}

/// Finds a shortest four-direction path using A*.
///
/// The returned path includes both the start and goal positions.
pub fn plan_path(grid: &Grid, start: Position, goal: Position) -> Result<Vec<Position>, PlanError> {
    if !grid.is_in_bounds(start) {
        return Err(PlanError::StartOutOfBounds);
    }
    if !grid.is_in_bounds(goal) {
        return Err(PlanError::GoalOutOfBounds);
    }
    if grid.is_obstacle(start) {
        return Err(PlanError::StartBlocked);
    }
    if grid.is_obstacle(goal) {
        return Err(PlanError::GoalBlocked);
    }

    let mut frontier = BinaryHeap::new();
    let mut came_from = HashMap::<Position, Position>::new();
    let mut best_cost = HashMap::<Position, usize>::new();

    best_cost.insert(start, 0);
    frontier.push((Reverse(start.manhattan_distance(goal)), Reverse(0usize), start));

    while let Some((Reverse(_priority), Reverse(current_cost), current)) = frontier.pop() {
        if current == goal {
            return Ok(reconstruct_path(&came_from, start, goal));
        }

        if best_cost.get(&current).copied() != Some(current_cost) {
            continue;
        }

        for neighbor in grid.neighbors(current) {
            let next_cost = current_cost + 1;
            let known_cost = best_cost.get(&neighbor).copied().unwrap_or(usize::MAX);

            if next_cost < known_cost {
                came_from.insert(neighbor, current);
                best_cost.insert(neighbor, next_cost);
                let priority = next_cost + neighbor.manhattan_distance(goal);
                frontier.push((Reverse(priority), Reverse(next_cost), neighbor));
            }
        }
    }

    Err(PlanError::NoPath)
}

fn reconstruct_path(
    came_from: &HashMap<Position, Position>,
    start: Position,
    goal: Position,
) -> Vec<Position> {
    let mut path = vec![goal];
    let mut current = goal;

    while current != start {
        current = came_from[&current];
        path.push(current);
    }

    path.reverse();
    path
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SafetyViolation {
    BatteryDepleted,
    DestinationOutOfBounds,
    DestinationBlocked,
    NonAdjacentMove,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SafetyDecision {
    Allow,
    Reject(SafetyViolation),
}

/// Validates a single grid movement before execution.
pub fn validate_move(
    grid: &Grid,
    from: Position,
    to: Position,
    battery_percent: u8,
) -> SafetyDecision {
    if battery_percent == 0 {
        return SafetyDecision::Reject(SafetyViolation::BatteryDepleted);
    }
    if !grid.is_in_bounds(to) {
        return SafetyDecision::Reject(SafetyViolation::DestinationOutOfBounds);
    }
    if grid.is_obstacle(to) {
        return SafetyDecision::Reject(SafetyViolation::DestinationBlocked);
    }
    if from.manhattan_distance(to) != 1 {
        return SafetyDecision::Reject(SafetyViolation::NonAdjacentMove);
    }

    SafetyDecision::Allow
}

/// Returns the battery units required to execute a path.
pub fn required_battery(path: &[Position], movement_cost: u32) -> u32 {
    path.len().saturating_sub(1) as u32 * movement_cost
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_grid() -> Grid {
        Grid::new(
            5,
            5,
            [Position::new(1, 0), Position::new(1, 1), Position::new(1, 2)],
        )
        .expect("sample grid should be valid")
    }

    #[test]
    fn planner_routes_around_obstacles() {
        let path = plan_path(&sample_grid(), Position::new(0, 0), Position::new(2, 0))
            .expect("a route should exist");

        assert_eq!(path.first(), Some(&Position::new(0, 0)));
        assert_eq!(path.last(), Some(&Position::new(2, 0)));
        assert!(path.iter().all(|position| !sample_grid().is_obstacle(*position)));
        assert_eq!(path.len(), 9);
    }

    #[test]
    fn planner_rejects_blocked_goal() {
        let result = plan_path(&sample_grid(), Position::new(0, 0), Position::new(1, 1));
        assert_eq!(result, Err(PlanError::GoalBlocked));
    }

    #[test]
    fn planner_reports_when_no_path_exists() {
        let grid = Grid::new(
            3,
            3,
            [Position::new(1, 0), Position::new(1, 1), Position::new(1, 2)],
        )
        .expect("grid should be valid");

        assert_eq!(
            plan_path(&grid, Position::new(0, 1), Position::new(2, 1)),
            Err(PlanError::NoPath)
        );
    }

    #[test]
    fn safety_rejects_obstacle_entry() {
        assert_eq!(
            validate_move(&sample_grid(), Position::new(0, 1), Position::new(1, 1), 90),
            SafetyDecision::Reject(SafetyViolation::DestinationBlocked)
        );
    }

    #[test]
    fn safety_rejects_non_adjacent_move() {
        assert_eq!(
            validate_move(&sample_grid(), Position::new(0, 0), Position::new(0, 2), 90),
            SafetyDecision::Reject(SafetyViolation::NonAdjacentMove)
        );
    }

    #[test]
    fn safety_rejects_depleted_battery() {
        assert_eq!(
            validate_move(&sample_grid(), Position::new(0, 0), Position::new(0, 1), 0),
            SafetyDecision::Reject(SafetyViolation::BatteryDepleted)
        );
    }

    #[test]
    fn battery_cost_counts_movements_not_positions() {
        let path = [
            Position::new(0, 0),
            Position::new(0, 1),
            Position::new(1, 1),
        ];

        assert_eq!(required_battery(&path, 2), 4);
    }
}
