// SPDX-License-Identifier: MIT

import { isBlocked, isInside } from './planner.js';

export function evaluateMove(world, robot, next) {
  if (robot.battery <= 0) {
    return { allowed: false, reason: 'Battery depleted' };
  }
  if (!isInside(world, next)) {
    return { allowed: false, reason: 'World boundary reached' };
  }
  if (isBlocked(world, next)) {
    return { allowed: false, reason: 'Obstacle collision prevented' };
  }
  return { allowed: true, reason: 'Move approved' };
}

export function batteryCost(from, to) {
  return from.x === to.x && from.y === to.y ? 0 : 1;
}

export function safetyState(robot) {
  if (robot.battery <= 10) return 'critical';
  if (robot.battery <= 30) return 'warning';
  return 'nominal';
}
