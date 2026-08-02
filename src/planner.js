// SPDX-License-Identifier: MIT

const key = ({ x, y }) => `${x},${y}`;
const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function isInside(world, point) {
  return point.x >= 0 && point.y >= 0 && point.x < world.width && point.y < world.height;
}

export function isBlocked(world, point) {
  return world.obstacles.some((item) => item.x === point.x && item.y === point.y);
}

export function findPath(world, start, goal) {
  if (!isInside(world, start) || !isInside(world, goal) || isBlocked(world, goal)) {
    return [];
  }

  const open = [start];
  const cameFrom = new Map();
  const gScore = new Map([[key(start), 0]]);
  const fScore = new Map([[key(start), manhattan(start, goal)]]);

  while (open.length > 0) {
    open.sort((a, b) => (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity));
    const current = open.shift();

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    for (const direction of directions) {
      const neighbor = { x: current.x + direction.x, y: current.y + direction.y };
      if (!isInside(world, neighbor) || isBlocked(world, neighbor)) continue;

      const tentative = (gScore.get(key(current)) ?? Infinity) + 1;
      if (tentative >= (gScore.get(key(neighbor)) ?? Infinity)) continue;

      cameFrom.set(key(neighbor), current);
      gScore.set(key(neighbor), tentative);
      fScore.set(key(neighbor), tentative + manhattan(neighbor, goal));
      if (!open.some((item) => item.x === neighbor.x && item.y === neighbor.y)) {
        open.push(neighbor);
      }
    }
  }

  return [];
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current));
    path.unshift(current);
  }
  return path;
}
