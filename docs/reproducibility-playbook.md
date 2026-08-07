# Reproducibility Playbook

This playbook describes how to record and interpret Embodied AI Mission Lab runs.

## Minimum run record

Every experiment should record:

- Repository commit.
- Browser and Node.js version.
- Map/grid configuration.
- Obstacle layout.
- Start state.
- Target or clicked goal.
- Planner settings.
- Safety-kernel settings.
- Battery level and movement cost assumptions.
- Sensor model assumptions.
- Mission trace file or exported mission JSON.
- Pass/fail criteria.

## Evidence bundle

A complete reproducibility bundle should include:

```text
mission_goal.json
mission_export.json
event_trace.json
planner_decisions.json
safety_gate_decisions.json
sensor_observations.json
notes.md
```

## Interpretation rules

- A successful simulation does not prove real hardware safety.
- A planner path is not an execution authorization.
- A blocked movement should be treated as useful safety evidence, not a bug by default.
- Sensor rays are simulated and should not be interpreted as calibrated physical perception.
- Hardware adapters require separate validation.

## Suggested experiment table

| Field | Example |
|---|---|
| Map | `default-grid-v1` |
| Planner | `A*` |
| Safety gates | boundary, obstacle, battery |
| Mission target | grid coordinate or named goal |
| Execution mode | step-by-step or full mission |
| Outcome | completed, blocked, battery depleted, invalid target |
| Evidence | trace and JSON export |

## Checklist before reporting results

- Confirm that the same goal reproduces the same route.
- Confirm that blocked moves are logged with reasons.
- Confirm that exported JSON contains mission metadata.
- Confirm that battery behavior is documented.
- Confirm that the README boundary is cited when presenting results.
