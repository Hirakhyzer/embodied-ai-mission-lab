// SPDX-License-Identifier: MIT

import { MissionSimulator } from './simulator.js';
import { scan } from './sensors.js';

const cellSize = 42;
const defaultWorld = {
  width: 14,
  height: 10,
  obstacles: [
    { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 },
    { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 },
    { x: 10, y: 7 }, { x: 11, y: 7 }, { x: 12, y: 7 },
    { x: 5, y: 7 }, { x: 5, y: 8 }
  ],
  targets: [
    { x: 12, y: 2, label: 'Medical Kit', kind: 'supply' },
    { x: 2, y: 8, label: 'Inspection Zone', kind: 'inspection' },
    { x: 9, y: 8, label: 'Charging Pad', kind: 'charger' }
  ]
};
const startRobot = { x: 1, y: 1, battery: 100, name: 'Atlas-01' };
let simulator = new MissionSimulator(defaultWorld, startRobot);
let timer = null;

const canvas = document.querySelector('#world');
const context = canvas.getContext('2d');
const goalSelect = document.querySelector('#goal-select');
const statusText = document.querySelector('#status-text');
const batteryText = document.querySelector('#battery-text');
const stepsText = document.querySelector('#steps-text');
const pathText = document.querySelector('#path-text');
const eventList = document.querySelector('#event-list');
const sensorGrid = document.querySelector('#sensor-grid');

canvas.width = defaultWorld.width * cellSize;
canvas.height = defaultWorld.height * cellSize;

for (const target of defaultWorld.targets) {
  const option = document.createElement('option');
  option.value = `${target.x},${target.y}`;
  option.textContent = target.label;
  goalSelect.append(option);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  for (const obstacle of simulator.world.obstacles) {
    drawCell(obstacle, '#27334d');
    context.fillStyle = '#7f8ca8';
    context.font = '18px sans-serif';
    context.fillText('▦', obstacle.x * cellSize + 12, obstacle.y * cellSize + 27);
  }

  for (const [index, point] of simulator.path.entries()) {
    context.fillStyle = `rgba(96, 165, 250, ${Math.max(0.2, 0.75 - index * 0.025)})`;
    context.beginPath();
    context.arc(point.x * cellSize + cellSize / 2, point.y * cellSize + cellSize / 2, 7, 0, Math.PI * 2);
    context.fill();
  }

  for (const target of simulator.world.targets) {
    const palette = { supply: '#22c55e', inspection: '#f59e0b', charger: '#a78bfa' };
    drawCell(target, palette[target.kind] ?? '#22c55e', 8);
    context.fillStyle = '#061018';
    context.font = 'bold 13px sans-serif';
    context.fillText(target.kind === 'charger' ? '⚡' : target.kind === 'supply' ? '+' : '◎', target.x * cellSize + 14, target.y * cellSize + 26);
  }

  context.fillStyle = '#38bdf8';
  context.beginPath();
  context.arc(simulator.robot.x * cellSize + cellSize / 2, simulator.robot.y * cellSize + cellSize / 2, 15, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#04111b';
  context.font = 'bold 13px sans-serif';
  context.fillText('AI', simulator.robot.x * cellSize + 13, simulator.robot.y * cellSize + 26);

  renderStats();
}

function drawGrid() {
  context.strokeStyle = '#1e2b44';
  context.lineWidth = 1;
  for (let x = 0; x <= simulator.world.width; x += 1) {
    context.beginPath();
    context.moveTo(x * cellSize, 0);
    context.lineTo(x * cellSize, canvas.height);
    context.stroke();
  }
  for (let y = 0; y <= simulator.world.height; y += 1) {
    context.beginPath();
    context.moveTo(0, y * cellSize);
    context.lineTo(canvas.width, y * cellSize);
    context.stroke();
  }
}

function drawCell(point, color, inset = 4) {
  context.fillStyle = color;
  context.fillRect(point.x * cellSize + inset, point.y * cellSize + inset, cellSize - inset * 2, cellSize - inset * 2);
}

function renderStats() {
  statusText.textContent = simulator.status;
  batteryText.textContent = `${simulator.robot.battery}%`;
  stepsText.textContent = simulator.stepCount;
  pathText.textContent = simulator.path.length;
  eventList.innerHTML = simulator.events.slice(0, 10).map((event) => `
    <li><span class="event-source ${event.source}">${event.source}</span><div><strong>${event.message}</strong><small>${event.time}</small></div></li>
  `).join('');

  const readings = scan(simulator.world, simulator.robot);
  sensorGrid.innerHTML = readings.map((reading) => `
    <article><span>${reading.direction}</span><strong>${reading.distance} cells</strong><small>${reading.hit}</small></article>
  `).join('');
}

function selectedGoal() {
  const [x, y] = goalSelect.value.split(',').map(Number);
  return { x, y };
}

function plan() {
  stopTimer();
  simulator.planTo(selectedGoal());
  draw();
}

function step() {
  simulator.step();
  draw();
}

function run() {
  if (simulator.path.length === 0 && !simulator.planTo(selectedGoal())) {
    draw();
    return;
  }
  stopTimer();
  timer = window.setInterval(() => {
    const result = simulator.step();
    draw();
    if (result.complete) stopTimer();
  }, 320);
}

function stopTimer() {
  if (timer) window.clearInterval(timer);
  timer = null;
}

function reset() {
  stopTimer();
  simulator.reset(startRobot);
  draw();
}

function exportMission() {
  const payload = {
    name: `Mission to ${goalSelect.options[goalSelect.selectedIndex].text}`,
    version: '1.0',
    world: simulator.world,
    robot: startRobot,
    goal: selectedGoal()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'embodied-ai-mission.json';
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelector('#plan-button').addEventListener('click', plan);
document.querySelector('#step-button').addEventListener('click', step);
document.querySelector('#run-button').addEventListener('click', run);
document.querySelector('#reset-button').addEventListener('click', reset);
document.querySelector('#export-button').addEventListener('click', exportMission);
goalSelect.addEventListener('change', plan);
canvas.addEventListener('click', (event) => {
  const rectangle = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rectangle.left) / (rectangle.width / simulator.world.width));
  const y = Math.floor((event.clientY - rectangle.top) / (rectangle.height / simulator.world.height));
  simulator.planTo({ x, y });
  draw();
});

draw();
plan();
