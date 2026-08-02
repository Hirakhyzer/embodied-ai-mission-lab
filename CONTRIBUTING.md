# Contributing

Thank you for helping build Embodied AI Mission Lab.

## Development

1. Fork and clone the repository.
2. Create a focused branch from `main`.
3. Serve the repository with `python3 -m http.server 8000`.
4. Run `npm test` before opening a pull request.

Use Conventional Commits, for example:

```text
feat(planner): add weighted terrain costs
fix(safety): reject invalid battery values
docs: explain simulator adapter interface
```

Keep changes focused and include tests for planner, safety, sensor, or simulator logic. UI changes should include a screenshot in the pull request.
