# Governance and Safety Boundary

Embodied AI Mission Lab is an independent research and teaching prototype for browser-based robot mission planning, simulation, sensing, safety checks, and trace inspection.

## Intended use

Acceptable uses include:

- Teaching embodied AI, robot planning, and simulation workflows.
- Testing grid-world mission planning before hardware-specific adapters exist.
- Comparing planner behavior, safety-gate decisions, battery constraints, and trace output.
- Exporting mission JSON for review, classroom use, benchmark design, and research notes.
- Designing responsible human-in-the-loop mission workflows.

## Non-intended use

This project is not intended for:

- Direct physical robot control.
- Autonomous deployment in homes, hospitals, factories, roads, airports, or public spaces.
- Safety-critical navigation.
- Emergency response robotics.
- Surveillance, pursuit, weaponization, or harmful automation.
- Bypassing hardware safety systems.
- Replacing robot-specific validation, operator supervision, emergency-stop controls, or compliance review.

## Hardware-readiness boundary

The default repository is simulation-only. Before any real robot adapter is connected, the following must be addressed:

1. Validated map representation.
2. Calibrated sensor model.
3. Physical robot kinematic constraints.
4. Emergency-stop and manual override.
5. Collision and speed limits.
6. Battery and thermal safety.
7. Operator supervision.
8. Logging, rollback, and incident review.
9. Environment-specific risk assessment.
10. Legal and institutional approval where needed.

## Human oversight

Every mission should be reviewable before execution. Planner output should be treated as a proposal, not an autonomous authorization.

## Data boundary

The lab should use synthetic maps, synthetic targets, and simulated sensor readings by default. Real sensor streams require consent, privacy review, data minimization, and secure storage.
