// SPDX-License-Identifier: MIT

import { findPath } from './planner.js';
import { batteryCost, evaluateMove, safetyState } from './safety.js';
import { detectNearbyTargets, scan } from './sensors.js';

export class MissionSimulator {
  constructor(world, robot) {
    this.world = structuredClone(world);
    this.robot = structuredClone(robot);
    this.events = [];
    this.path = [];
    this.status = 'idle';
    this.stepCount = 0;
    this.log('system', 'Simulation initialized');
  }

  planTo(goal) {
    const path = findPath(this.world, this.robot, goal);
    this.path = path.slice(1);
    if (path.length === 0) {
      this.status = 'blocked';
      this.log('planner', `No safe path to (${goal.x}, ${goal.y})`);
      return false;
    }
    this.status = 'planned';
    this.log('planner', `Planned ${this.path.length} steps to (${goal.x}, ${goal.y})`);
    return true;
  }

  step() {
    if (this.path.length === 0) {
      this.status = 'complete';
      this.log('executor', 'Mission path complete');
      return { complete: true };
    }

    const next = this.path.shift();
    const decision = evaluateMove(this.world, this.robot, next);
    if (!decision.allowed) {
      this.status = 'halted';
      this.log('safety', decision.reason);
      return { complete: true, halted: true, reason: decision.reason };
    }

    const previous = { x: this.robot.x, y: this.robot.y };
    this.robot.x = next.x;
    this.robot.y = next.y;
    this.robot.battery = Math.max(0, this.robot.battery - batteryCost(previous, next));
    this.stepCount += 1;
    this.status = this.path.length === 0 ? 'complete' : 'running';

    const nearby = detectNearbyTargets(this.world, this.robot);
    const sensors = scan(this.world, this.robot);
    this.log('executor', `Moved to (${next.x}, ${next.y}); battery ${this.robot.battery}%`);
    if (nearby.length > 0) {
      this.log('perception', `Detected: ${nearby.map((target) => target.label).join(', ')}`);
    }

    return {
      complete: this.path.length === 0,
      sensors,
      nearby,
      safety: safetyState(this.robot)
    };
  }

  reset(robot) {
    this.robot = structuredClone(robot);
    this.path = [];
    this.status = 'idle';
    this.stepCount = 0;
    this.events = [];
    this.log('system', 'Simulation reset');
  }

  log(source, message) {
    this.events.unshift({
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      source,
      message,
      time: new Date().toLocaleTimeString()
    });
  }
}
