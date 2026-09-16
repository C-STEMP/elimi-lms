# Features

Each feature is a self-contained module. Nothing outside a feature folder imports
from its internals — only from its `index.ts` barrel.

```
features/
  <feature-name>/
    api/            # axios calls for this feature, raw request functions only
    hooks/          # TanStack Query hooks (useX, useCreateX...) wrapping api/
    types/          # request/response types for this feature
    components/     # UI local to this feature, meant to be used by pages
    lib/            # optional: non-React support code too substantial for hooks/ (e.g. a runtime engine)
    index.ts        # public exports (hooks, types, and components pages use)
```

Rules:

- `api/` functions call `lmsClient` or `orchestratorClient` from `@/shared/api/clients` and return typed data via `unwrapItem`/`unwrapList` (`@/shared/api/response`). No React, no query hooks, no side effects (e.g. token storage) here — those belong in `hooks/`.
- `hooks/` wrap `api/` calls with `useQuery` / `useMutation`. Query keys live next to the hooks that own them.
- Only what a feature exports from `index.ts` is importable elsewhere. Everything else is a private implementation detail.
- Cross-feature UI composition happens in `app/` (pages/layouts), not by features importing each other directly.
