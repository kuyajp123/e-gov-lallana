## Framework-neutral feature organization

- Treat this section as the portable baseline for application code. Preserve the repository- and platform-specific rules above; use the equivalent names and primitives supplied by the active framework rather than forcing React conventions into another framework.
- Organize code by product capability first. A feature owns its UI, routes or pages, state, data access, domain types, helpers, assets, and tests until those pieces are genuinely reused outside that feature.
- Keep one shared/global location only. A new application may use `src/shared/{components,hooks,stores,lib,services,types,helpers}` or the equivalent flat `src/{components,hooks,stores,lib,services,types,helpers}` layout, but never create both conventions in the same application. This repository uses `src/shared/` as its global location.
- Promote a module to the shared/global location only after it is used by more than one feature or represents an infrastructure boundary. Do not create generic shared abstractions pre-emptively.

### Preferred layout

```text
src/
├── app/                         # Composition, routing, providers, layouts, and bootstrap
├── features/
│   └── <feature>/
│       ├── index.ts              # The feature's public entry point
│       ├── components/           # Feature-only UI
│       ├── pages/                # Or views/, routes/, screens/, or containers/
│       ├── hooks/                # Or composables/ in frameworks that use them
│       ├── store/                # Feature-scoped client state, when needed
│       ├── services/             # API clients, gateways, repositories, and use cases
│       ├── types/                # Or models/, entities/, schemas/, and contracts/
│       ├── lib/                  # Feature-only pure helpers, utilities, and constants
│       ├── assets/               # Feature-only static assets, when needed
│       └── tests/                # Or colocated *.test.* / *.spec.* files
└── shared/                       # The single global location in this repository
    ├── components/
    ├── hooks/
    ├── stores/
    ├── lib/                      # Utilities, helpers, and infrastructure clients
    ├── services/
    └── types/
```

- Folders are optional: create only the folders a feature needs. Keep related tools such as schemas, constants, adapters, mocks, and test fixtures within the owning feature unless they meet the shared/global rule.
- Use a framework-appropriate entry extension (`index.ts`, `index.tsx`, `index.vue`, and so on). Export only the feature's supported public API from that entry point; consumers must not deep-import feature internals.
- Keep framework composition and application-wide concerns in `src/app/`; keep business behavior in a feature. A component or view must delegate data access and non-trivial business logic to its feature's hooks, services, or library code.

### Imports and boundaries

- Use the configured source-root alias for application imports. In projects that configure `@/`, including this repository, import source files with `@/...` instead of climbing directories with `../../...`. Keep alias configuration consistent across the compiler, bundler, test runner, linter, and editor.
- Use package imports for external dependencies and relative imports only when the toolchain cannot support the configured alias or for a direct framework-required neighbor import. Do not introduce a new alias without configuring every affected tool.
- Features may consume shared code and another feature's public entry point, but never another feature's private files. Avoid circular feature dependencies.

### State, async data, and HTTP

- Keep state that is used only by one React component or file in `useState`. In non-React frameworks, use the closest component-local state primitive rather than a global store.
- Use a feature-local `store/` or state module only for client state shared within that feature. Use Zustand for React client state that is truly global or shared across features; in non-React applications, use the framework's established equivalent. Do not elevate short-lived or feature-private state to a global store.
- Use TanStack React Query in React applications for async, cacheable server or gateway data when applicable. Colocate feature query hooks and query keys, invalidate only the affected keys after mutations, and do not duplicate query-cache data in Zustand. In other frameworks, use the configured framework-compatible query/cache solution instead.
- For HTTP APIs, use Axios consistently through a shared, configured client and feature-owned service functions rather than calling `fetch` directly. Keep endpoint contracts, error mapping, authentication, and interceptors at the client/service boundary; UI code must not call Axios directly. Do not add Axios when an application has no HTTP API or its platform forbids network access.
- In this offline-first Tauri application, typed Tauri gateways remain the required data boundary and replace HTTP/Axios calls. They are still appropriate inputs to React Query where cached asynchronous data is useful.

### Tests and maintainability

- Keep unit and integration tests inside the feature they exercise, either beside the source file or in that feature's `tests/` directory. Put shared-module tests beside their shared module; reserve top-level end-to-end tests for cross-feature user journeys.
- Name files by responsibility, keep functions and components small, and prefer explicit types/contracts at feature boundaries. Separate presentation, state orchestration, data access, and pure domain logic so each can change independently.
- Before moving code to a global folder, verify that it has a stable API and more than one real consumer. Preserve feature ownership whenever reuse is speculative.
