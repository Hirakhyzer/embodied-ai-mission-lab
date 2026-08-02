// SPDX-License-Identifier: MIT

import { isBlocked, isInside } from './planner.js';

const rays = [
  { name: 'east', dx: 1, dy: 0 },
  { name: 'west', dx: -1, dy: 0 },
  { name: 'south', dx: 0, dy: 1 },
  { name: 'north', dx: 0, dy: -1 }
];

export function scan(world, robot, maxRange = 6) {
  return rays.map((ray) => {
    for (let distance = 1; distance <= maxRange; distance += 1) {
      const point = { x: robot.x + ray.dx * distance, y: robot.y + ray.dy * distance };
      if (!isInside(world, point)) {
        return { direction: ray.name, distance: distance - 1, hit: 'boundary' };
      }
      if (isBlocked(world, point)) {
        return { direction: ray.name, distance, hit: 'obstacle' };
      }
    }
    return { direction: ray.name, distance: maxRange, hit: 'clear' };
  });
}

export function detectNearbyTargets(world, robot, radius = 2) {
  return world.targets.filter((target) => {
    const distance = Math.abs(target.x - robot.x) + Math.abs(target.y - robot.y);
    return distance <= radius;
  });
}
