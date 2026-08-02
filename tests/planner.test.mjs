// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { findPath, manhattan } from '../src/planner.js';

const world = { width: 5, height: 5, obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }] };

test('manhattan distance is deterministic', () => {
  assert.equal(manhattan({ x: 0, y: 0 }, { x: 3, y: 4 }), 7);
});

test('planner routes around obstacles', () => {
  const path = findPath(world, { x: 0, y: 0 }, { x: 2, y: 0 });
  assert.ok(path.length > 3);
  assert.deepEqual(path.at(0), { x: 0, y: 0 });
  assert.deepEqual(path.at(-1), { x: 2, y: 0 });
  assert.equal(path.some((point) => point.x === 1 && point.y === 0), false);
});

test('planner rejects blocked goals', () => {
  assert.deepEqual(findPath(world, { x: 0, y: 0 }, { x: 1, y: 1 }), []);
});
