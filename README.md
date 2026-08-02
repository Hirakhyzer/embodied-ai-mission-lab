<div align="center">

# 🤖 Embodied AI Mission Lab

**Design, simulate, inspect, and evaluate robot missions before deploying to hardware.**

![Release](https://img.shields.io/badge/release-v0.1.0-38bdf8)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-f7df1e?logo=javascript&logoColor=black)
![Tests](https://img.shields.io/badge/tests-Node%20built--in-22c55e)
![Hardware](https://img.shields.io/badge/hardware-not%20required-a78bfa)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

Embodied AI Mission Lab is an open-source browser platform for prototyping embodied intelligence. The first release includes a visual grid-world simulator, A* mission planner, simulated range sensing, a movement safety gate, battery-aware execution, explainable event traces, and mission JSON export.

## Live capabilities

| Subsystem | What works in v0.1 |
|---|---|
| Mission Studio | Choose targets or click arbitrary grid goals |
| Planner | Generate collision-free paths with A* |
| Safety Kernel | Block boundaries, obstacles, and depleted-battery movement |
| Sensor Model | Four directional range rays and nearby target detection |
| Executor | Run one step or execute a complete mission |
| Observability | Review planner, safety, perception, and execution events |
| Portability | Runs locally with no backend and no robot hardware |

## Quick start

```bash
git clone https://github.com/Hirakhyzer/embodied-ai-mission-lab.git
cd embodied-ai-mission-lab
python3 -m http.server 8000
```

Open `http://localhost:8000`.

Run tests with Node.js 20 or newer:

```bash
npm test
```

## System model

```mermaid
flowchart LR
    A[Mission Goal] --> B[A* Planner]
    B --> C[Safety Kernel]
    C --> D[Mission Executor]
    D --> E[Virtual Robot]
    E --> F[Sensor Model]
    F --> G[Execution Trace]
    G --> A
```

## Project structure

```text
embodied-ai-mission-lab/
├── index.html
├── styles.css
├── src/
│   ├── app.js
│   ├── planner.js
│   ├── safety.js
│   ├── sensors.js
│   └── simulator.js
├── tests/
├── examples/
├── docs/
└── .github/
```

## Vision

The long-term goal is a hardware-neutral experimentation platform where missions target capabilities rather than robot vendors. Planned adapters include Webots, MuJoCo, ROS 2, recorded sensor streams, and physical robots.

Read [the architecture](docs/ARCHITECTURE.md), [mission schema](docs/MISSION_SCHEMA.md), and [roadmap](docs/ROADMAP.md).

## Contributing

New contributors can improve UI accessibility, build mission import, add planners, create benchmark maps, or design simulator adapters. Read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License.
