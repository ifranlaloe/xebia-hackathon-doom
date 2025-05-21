# Copilot Custom Instructions for Deno Project

- This workspace is a Deno project.
- It is a web application (browser-based).
- Prefer Deno standard library and idioms over Node.js or npm packages.
- Use ES modules (`import`/`export`) syntax.
- Avoid using Node.js-specific APIs (like `require`, `__dirname`, etc.).
- Use `deno run` for running scripts.
- When suggesting code, assume TypeScript by default.
- For dependencies, use direct URL imports or Deno's import maps if needed.
- Prefer cross-platform, browser-compatible code when possible.
