# Mission schema

Mission exports use JSON and are intentionally small in v0.1.

```json
{
  "name": "Mission to Medical Kit",
  "version": "1.0",
  "world": {
    "width": 14,
    "height": 10,
    "obstacles": [{ "x": 3, "y": 1 }],
    "targets": [{ "x": 12, "y": 2, "label": "Medical Kit", "kind": "supply" }]
  },
  "robot": { "name": "Atlas-01", "x": 1, "y": 1, "battery": 100 },
  "goal": { "x": 12, "y": 2 }
}
```

Future versions may add capability requirements, task graphs, timing constraints, safety policies, multiple robots, sensor profiles, and evaluation criteria.
