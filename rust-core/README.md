# Mission Lab Rust Core

This crate provides hardware-neutral planning and safety primitives for Embodied AI Mission Lab.

## Included in the first Rust contribution

- A* path planning on rectangular grids
- Explicit errors for invalid, blocked, and unreachable goals
- Movement safety decisions for boundaries, obstacles, battery state, and invalid jumps
- Mission battery estimation
- Seven unit tests
- A runnable mission-planning example

The crate has no third-party dependencies. It builds as both an `rlib` and `cdylib`, leaving a direct path toward WebAssembly integration.

## Run the tests

```bash
cargo test --manifest-path rust-core/Cargo.toml
```

## Run the example

```bash
cargo run --manifest-path rust-core/Cargo.toml --example plan_mission
```

## Format and lint

```bash
cargo fmt --manifest-path rust-core/Cargo.toml -- --check
cargo clippy --manifest-path rust-core/Cargo.toml --all-targets -- -D warnings
```

## Next integration step

A future contribution can add `wasm-bindgen` wrappers so the browser interface calls this Rust planner directly instead of using the JavaScript planner. The pure Rust types should remain separate from browser-specific bindings to keep the engine reusable for CLI tools, simulators, ROS 2 adapters, and physical robots.
