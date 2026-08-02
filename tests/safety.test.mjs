// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateMove, safetyState } from '../src/safety.js';

const world = { width: 3, height: 3, obstacles: [{ x: 1, y: 1 }] };

test('safety gate prevents obstacle collision', () => {
  const result = evaluateMove(world, { x: 0, y: 1, battery: 100 }, { x: 1, y: 1 });
  assert.equal(result.allowed, false);
});

test('safety gate prevents movement with depleted battery', () => {
  const result = evaluateMove(world, { x: 0, y: 0, battery: 0 }, { x: 0, y: 1 });
  assert.equal(result.allowed, false);
});

test('battery warning levels are explicit', () => {
  assert.equal(safetyState({ battery: 100 }), 'nominal');
  assert.equal(safetyState({ battery: 20 }), 'warning');
  assert.equal(safetyState({ battery: 5 }), 'critical');
});
