## Build, Lint, and Test

- **Build:** `pnpm build`
- **Test:** `pnpm test`
- **Run a single test:** `pnpm test <path_to_test_file>`
- **Lint:** No dedicated lint command found. Follow existing code style.

## Code Style Guidelines

- **Formatting:** Use 2 spaces for indentation.
- **Imports:**
    - Use `~~/` for aliases to the project root.
    - Group imports from libraries, then project files.
- **Types:** Use TypeScript. Define types in `shared/types.d.ts`.
- **Naming Conventions:**
    - **Files:** Use kebab-case for components (`my-component.vue`) and API routes (`[id].get.ts`).
    - **Variables:** Use camelCase (`myVariable`).
    - **Functions:** Use camelCase (`myFunction`).
- **Error Handling:** Use `try...catch` blocks for async operations. Use `sendError` and `createError` in API routes.
- **API:** Use `useFetch` in components and `defineEventHandler` in server routes.
- **State Management:** Use Pinia for state management.
- **Database:** Use Drizzle ORM for database access.

## Agent Interaction Rules

- **Planning and Approval:** Before making any code changes, create a detailed plan and ask for user approval. Implement changes only after approval.
- **Branching Policy:** Never make direct changes to the `main` branch. If the current branch is `main`, create a new feature branch (e.g., `feature/my-new-feature`) and implement changes there.
- **Commit Policy:** Do not make any `git commit` commands. The user will handle commits manually.
