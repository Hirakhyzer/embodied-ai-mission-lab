# Publication Readiness Plan

Embodied AI Mission Lab can be extended into an academic software-engineering, robotics, or cyber-physical systems paper.

## Possible paper framing

**Working title:** A Browser-Based Embodied AI Mission Lab for Safe Robot Planning, Simulation, and Traceable Mission Review

## Research questions

1. Can a lightweight browser simulator make robot mission planning easier to inspect?
2. How do safety gates affect mission completion, blocked actions, and trace interpretability?
3. Can event traces improve explainability for planner and executor decisions?
4. What evidence is needed before moving from simulation to hardware adapters?

## Suggested evaluation sections

| Section | Evidence to collect |
|---|---|
| Planner correctness | shortest or valid path checks across benchmark maps |
| Safety kernel | blocked boundary, obstacle, and battery cases |
| Sensor model | directional range examples and target detection cases |
| Usability | mission setup steps and trace review workflow |
| Reproducibility | exported JSON, test commands, and run records |
| Hardware-readiness | adapter requirements and deployment boundary |

## Candidate benchmark maps

- Empty grid.
- Narrow corridor.
- Obstacle maze.
- Dead-end map.
- Battery-constrained map.
- Multi-target inspection map.
- Dynamic obstacle extension map.

## Claims to avoid

Do not claim:

- Real robot safety.
- Real-world navigation readiness.
- Certified collision avoidance.
- Deployment-grade autonomy.
- Human-free mission approval.

## Extension roadmap

1. Add mission import.
2. Add benchmark map library.
3. Add multiple planners.
4. Add comparison metrics.
5. Add Webots, MuJoCo, or ROS 2 adapter proposal.
6. Add human-in-the-loop evaluation study.
