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

## SOLID and Clean Code Principles

### SOLID Principles
- **Single Responsibility Principle**: Each module, class, or function should have only one reason to change.
- **Open/Closed Principle**: Software entities should be open for extension but closed for modification.
- **Liskov Substitution Principle**: Objects should be replaceable with instances of their subtypes without altering program correctness.
- **Interface Segregation Principle**: Many client-specific interfaces are better than one general-purpose interface.
- **Dependency Inversion Principle**: Depend on abstractions, not on concretions.

### Clean Code Guidelines
- Write descriptive and meaningful variable/function names.
- Keep functions small and focused on a single task.
- Limit function parameters (aim for 3 or fewer when possible).
- Avoid deep nesting of code blocks.
- Use early returns to reduce nesting.
- Add meaningful comments for complex logic only; prefer self-documenting code.
- Consistently format code (use Deno's built-in formatter).
- Write automated tests for your code.
- Follow the DRY principle (Don't Repeat Yourself).
- Use pure functions where possible.
- Handle errors appropriately and gracefully.
- Prefer immutable data structures.
- Organize related code in cohesive modules.
