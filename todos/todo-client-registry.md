# TODO: Implement Client-Side Registry

**Phase:** 1 (Core Framework)
**Package:** `@mcpc/core`

## Task

Implement the client-side registry for storing and retrieving `MCPCDefinition` objects. This registry is essential for the `McpcMessageRenderer` to dynamically find the correct UI for a given tool call.

## API

1.  **`registerMcpcDefinition(definition: MCPCDefinition<any, any, any, any>): void`**
    *   Adds an `MCPCDefinition` to a global or context-scoped map, keyed by its `toolName`.
    *   Should warn the developer if a definition with the same `toolName` is already registered.

2.  **`getMcpcDefinition(toolName: string): MCPCDefinition<any, any, any, any> | undefined`**
    *   Retrieves a definition from the registry by its `toolName`.

## Implementation Details

-   The registry can be a simple in-memory map (e.g., `Map<string, MCPCDefinition>`).
-   The implementation should be in `packages/core/src/registry.ts`.
-   Both functions should be exported from the `@mcpc/core` package.

## Acceptance Criteria

-   `registerMcpcDefinition` and `getMcpcDefinition` are implemented.
-   Unit tests verify:
    -   A definition can be successfully registered and retrieved.
    -   Retrieving a non-existent definition returns `undefined`.
    -   Registering a duplicate `toolName` logs a warning.
