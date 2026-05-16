# Barrel Export Safety: Client Hooks Must Not Leak Into Server Bundles

---
paths:
  - "modules/**/index.ts"
  - "modules/**/hooks/index.ts"
---

## The Problem

Module barrel files (`modules/[name]/index.ts`) are imported by both client components AND API routes (server context). If a barrel re-exports React hooks (which use `useRef`, `useState`, `useEffect`, etc.), Next.js will fail at build time because hooks cannot be bundled in server contexts.

## The Rule

**Never export React hooks through a module's barrel chain that reaches `modules/[name]/index.ts`.**

Hooks barrels (`modules/[name]/hooks/index.ts`) are re-exported via `export * from "./hooks"` in the module root. Since API routes import from the module root (e.g., `import { SomeSchema } from "@/modules/tasks"`), any hook in that chain triggers a build error.

### What to do instead

1. **Hooks barrel should export nothing** (or only non-React utilities):
   ```typescript
   // modules/[name]/hooks/index.ts
   // All React hooks must be imported directly from their source files.
   export {};
   ```

2. **Components import hooks directly from their source files**:
   ```typescript
   // WRONG — barrel re-exports into server bundle
   import { useFetchJobs } from "../hooks";
   import { useFetchJobs } from "..";
   import { useFetchJobs } from "@/modules/tasks";

   // RIGHT — direct import, no barrel leakage
   import { useFetchJobs } from "../hooks/useTaskQueries";
   import { useTaskRealtime } from "../hooks/useTaskRealtime";
   import { useCancelJob } from "../hooks/useJobActions";
   ```

3. **Every hook file must have `"use client"` directive** at the top.

### Why this matters

- `modules/[name]/index.ts` is the **client-safe** barrel — but "client-safe" means safe for BOTH client and server (it exports types, schemas, configs)
- `modules/[name]/server.ts` is the **server-only** barrel (services, repositories)
- React hooks are **client-only** — they belong in neither barrel
- Next.js tree-shaking does NOT save you — the bundler evaluates the import chain before shaking

### How to verify

If you're adding a new hook or modifying hook exports, run:
```bash
yarn build
```
Build errors about `useRef`/`useState`/`useEffect` in server context mean a hook leaked through a barrel.
