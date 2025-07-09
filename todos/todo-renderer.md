# TODO: Develop McpcMessageRenderer

**Phase:** 1 (Core Framework)
**Package:** `@mcpc/react`

## Task

Develop the core `McpcMessageRenderer` React component. This component is responsible for inspecting AI SDK messages and rendering the appropriate MCPC UI when a tool call result is detected.

## Component Props

```typescript
interface McpcMessageRendererProps {
  message: Message; // From `ai/react`
  onMcpcAction: (actionDetails: { toolToCall: string; params: any }) => void;
}
```

## Logic Flow

1.  The component receives a `message` object.
2.  It checks if `message.role === 'tool'`.
3.  If it is, it uses `message.name` (the tool name) to look up the corresponding `MCPCDefinition` from the client-side registry (`getMcpcDefinition`).
4.  If a definition is found:
    a. It parses `message.content` (the tool result JSON) into an object.
    b. It calls the `dataTransformer` from the definition with the parsed result to get the props for the UI component.
    c. It renders the `uiComponent` from the definition, passing the transformed data and an `onAction` handler.
5.  The internal `onAction` handler will:
    a. Look up the action in the `uiActions` map of the definition.
    b. If the action is a server tool call, it calls the `onMcpcAction` prop with the new tool name and mapped parameters.
    c. If the action is a client-side action, it calls the corresponding function from `clientExecute`.
6.  If no definition is found, it should render a fallback UI (e.g., a simple display of the raw tool result).

## Acceptance Criteria

-   `McpcMessageRenderer` component is implemented in `packages/react/src/McpcMessageRenderer.tsx`.
-   The component correctly renders the UI for a tool message.
-   It correctly handles data transformation.
-   It correctly invokes the `onMcpcAction` prop when a UI action is triggered.
-   It renders a fallback for unregistered tool calls.
-   A Storybook story or example page demonstrates its usage.
