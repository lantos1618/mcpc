# TODO: Implement `createMCPC` Factory

**Phase:** 1 (Core Framework)
**Package:** `@mcpc/core`

## Task

Implement the `createMCPC` factory function. This function will be the primary developer-facing API for creating `MCPCDefinition` objects. It should take a configuration object and return a well-typed `MCPCDefinition`.

## Function Signature

```typescript
import { MCPCDefinition } from './types';

export function createMCPC<...generics...>(
  config: Partial<MCPCDefinition<...>>
): MCPCDefinition<...>;
```

## Implementation Details

-   The factory should accept a single configuration object matching the structure of `MCPCDefinition`.
-   It should apply sensible defaults where possible (e.g., an empty `uiActions` object).
-   It should perform basic validation to ensure required fields (`toolName`, `description`, `schema`, `execute`, `uiComponent`) are present.
-   The function should be strongly typed to infer as much as possible from the provided configuration.

## Acceptance Criteria

-   `createMCPC` function is implemented in `packages/core/src/createMCPC.ts`.
-   The function is exported from the main entry point of `@mcpc/core`.
-   The implementation includes unit tests to verify:
    -   A valid definition is created with correct properties.
    -   An error is thrown if required properties are missing.
    -   Default values are applied correctly.
