# TODO: Define Core Types

**Phase:** 1 (Core Framework)
**Package:** `@mcpc/core`

## Task

Define and implement the core TypeScript types that form the foundation of the `mcpc` protocol. These types will be used by the `createMCPC` factory and the `McpcMessageRenderer`.

## Key Types to Define

1.  **`MCPCDefinition<TToolParams, TExecuteResult, TData, TActionParams>`**
    *   `toolName`: `string`
    *   `description`: `string`
    *   `schema`: `z.ZodObject<any>` (or similar schema type)
    *   `execute`: `(params: TToolParams) => Promise<TExecuteResult>`
    *   `uiComponent`: `React.FC<MCPCRenderProps<TData, TActionParams>>`
    *   `dataTransformer`: `(result: TExecuteResult) => TData`
    *   `uiActions`: `Record<string, MCPCAction>`
    *   `clientExecute`: `Record<string, (params: any) => void>`

2.  **`MCPCRenderProps<TData, TActionParams>`**
    *   `data`: `TData` (The props for the UI component, transformed from the `execute` result)
    *   `onAction`: `(actionName: string, params: TActionParams) => void`

3.  **`MCPCAction`**
    *   `mcpToolName`: `string` (The tool to call for a server roundtrip)
    *   `mapParams`: `(params: any) => any` (Maps UI action params to tool params)
    *   `clientExecuteName`: `string` (The name of a function in `clientExecute` for client-side only actions)

## Acceptance Criteria

-   All types are clearly defined in a central file (e.g., `packages/core/src/types.ts`).
-   Types are generic and flexible enough to support various use cases.
-   Types are exported from the `@mcpc/core` package.
-   Code includes TSDoc comments explaining the purpose of each type and property.
