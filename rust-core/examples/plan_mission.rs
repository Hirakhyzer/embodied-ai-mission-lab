// SPDX-License-Identifier: MIT

use mission_lab_core::{plan_path, required_battery, Grid, Position};

fn main() {
    let grid = Grid::new(
        8,
        6,
        [
            Position::new(3, 1),
            Position::new(3, 2),
            Position::new(3, 3),
            Position::new(4, 3),
        ],
    )
    .expect("mission grid should be valid");

    let start = Position::new(1, 1);
    let goal = Position::new(6, 4);
    let path = plan_path(&grid, start, goal).expect("mission should have a safe route");

    println!("Mission route contains {} positions:", path.len());
    for position in &path {
        println!("  -> ({}, {})", position.x, position.y);
    }
    println!("Estimated battery requirement: {}%", required_battery(&path, 1));
}
