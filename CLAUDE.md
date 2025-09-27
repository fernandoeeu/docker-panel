# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `bun install` - Install dependencies (root and all workspaces)
- `bun dev` - Start all applications in development mode (web on :5173, server on :3000)
- `bun dev:web` - Start only the SvelteKit frontend
- `bun dev:server` - Start only the Hono backend with hot reload
- `bun build` - Build all applications for production
- `bun check-types` - TypeScript type checking across all workspaces

### Database Operations
- `cd apps/server && bun db:local` - Start local SQLite database with Turso dev
- `bun db:push` - Push schema changes to database
- `bun db:studio` - Open Drizzle Studio for database management
- `bun db:generate` - Generate migration files
- `bun db:migrate` - Apply migrations to database

### Individual App Commands
- `cd apps/web && bun run check` - SvelteKit type checking
- `cd apps/server && bun run compile` - Compile server to standalone binary

## Architecture

This is a monorepo using Turborepo with two main applications:

### Tech Stack
- **Frontend**: SvelteKit 5 + TailwindCSS 4 + TypeScript
- **Backend**: Hono + oRPC + TypeScript
- **Database**: SQLite/Turso + Drizzle ORM
- **Type Safety**: End-to-end via oRPC with shared types
- **Runtime**: Bun for all environments

### Project Structure
```
apps/
├── web/           # SvelteKit frontend
│   ├── src/
│   │   ├── routes/        # SvelteKit pages
│   │   ├── components/    # Svelte components
│   │   └── lib/
│   │       └── orpc.ts    # Client-side oRPC setup
│   └── package.json
└── server/        # Hono backend
    ├── src/
    │   ├── routers/       # oRPC router definitions
    │   ├── lib/
    │   │   ├── context.ts # Request context setup
    │   │   └── orpc.ts    # Server-side oRPC configuration
    │   ├── db/
    │   │   └── index.ts   # Drizzle database client
    │   └── index.ts       # Hono app entry point
    └── package.json
```

### Key Architectural Patterns

**Type-Safe API Communication**: Uses oRPC for end-to-end type safety between frontend and backend. The backend exports `AppRouter` type that's imported by the frontend for full TypeScript inference.

**Dual API Exposure**: The server exposes both RPC endpoints (`/rpc/*`) for the frontend and OpenAPI endpoints (`/api/*`) for external consumption, both using the same router definitions.

**Database Integration**: Drizzle ORM with SQLite/Turso provides type-safe database operations. Use `bun db:local` for development and configure `DATABASE_URL` for production.

**Frontend State Management**: Uses TanStack Query (Svelte) with oRPC integration for server state management and caching.

**Environment Configuration**:
- Frontend: Uses SvelteKit's `$env/static/public` for public env vars
- Backend: Uses dotenv for server configuration
- Set `PUBLIC_SERVER_URL` for frontend-to-backend communication
- Set `CORS_ORIGIN` for cross-origin requests

### Development Workflow

1. Start local database: `cd apps/server && bun db:local`
2. Push schema changes: `bun db:push`
3. Start development servers: `bun dev`
4. Frontend runs on http://localhost:5173
5. Backend runs on http://localhost:3000

The monorepo is configured with Turborepo for optimized builds and caching. All TypeScript compilation is handled by the respective framework build tools (Vite for web, tsdown for server).

## Git Workflow
- Do not include Claude Code on the commits message

## Coding Guidelines
TypeScript/JavaScript:
- Never use any; Almost never use "as".
- Aim for e2e type-safety;
- Let the compiler infer response types whenever possible.
- Always use named exports; Don't use default exports unless you have to.
- Don't have an index file only for exports.
- Prefer await/async over Promise().then()
- Unused vars should start with _ (or never exist at all);
- Prefer string literals over string concatenation.
- Don't abbreviate; use descriptive names.
- Always use early return over if-else.
- Prefer hash-lists over switch-case.
- Follow the programming language naming conventions (SNAKE_CAPS for constants, functions as camelCase, file names as kebab-case)
- Avoid indentation levels, strive for flat code.

React:
- Don't declare constants or functions inside components; keep them pure.
- Don't fetch data in useEffect, use React Query.
- Don't use magic strings for cache tags; use an enum/factory.
- Don't use magic numbers/strings;
- Use enum for react query cache strings
- Prefer <Suspense> and useSuspenseQuery over react query isLoading.
- Use errorBoundary with retry button

Software Programming;
- Avoid pre-mature optimization.
- Focus on:
  - e2e type-safety
  - observability
  - acessibility, a11y, WCAG 2.0 guidelines
  - security, OWASP best practices
- Comments are unnecessary 98% of the time, convert them to be a function/variable instead.
- Don't write pure SQL strings, query-builders help with type-safety and SQL-injection protection.
- use HighOrderFunctions for monitoring/error handling/profiling

Writing:
- Cut the bs, be concise, don't waste readers time
- Prefer active voice: "We fixed the bug" is better than "The bug was fixed by us"
- DOnt say "you are right", "i see the problem now", "exactly i am sorry" etc. NO BULL SHIT
- Prefer short sentences; 1 idea = 1 sentence
- Lead with result, return early, make outcomes obvious.
- Cut clutter: delete redundant words in names and code.

Naming:
- Code is reference, history and functionality. It must be readable as a journal.
- Names must say what they mean, descriptive.
- Avoid vague terms: data, item, list, component.
- Example: `userPayment` instead of `userPaymentData`, `users` instead of `userList`.

Simplicity:
- Don’t over-engineer.
- Short > long, but not cryptic.
- Avoid puns.
- Example: `retryCount` vs `maximumNumberOfTimesToRetryBeforeGivingUpOnTheRequest`.

Brevity:
- Every character must earn its place.
- Remove redundancy: `Users` not `UserList`.
- Avoid suffixes like `Manager`, `Helper`, `Service` unless essential.
- Example: `users` vs `userListDataItems`.

Voice:
- Voice = consistency.
- Use one style per project.
- Keep it simple and professional.

Revision:
- First commit: make it work.
- Then refactor: rename, cut duplication, reorganize.
- Code review = editing.

Beginnings & Endings:
- File/module names set expectations.
- Functions must resolve clearly.

Specificity:
- Be concrete: `retryAfterMs` > `timeout`.
- `emailValidator` > `validator`.
- Specific names reduce misuse.
