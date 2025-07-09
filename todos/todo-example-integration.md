# TODO: Example Integration

**Phase:** 1 (Core Framework)
**App:** `apps/next-app` (or similar example project)

## Task

Build a complete, end-to-end example application demonstrating the integration of `mcpc` with the Vercel AI SDK in a Next.js application.

## Key Parts of the Example

1.  **API Route (`/api/chat`)**
    *   Imports `MCPCDefinition`s (e.g., from `@mcpc/ui`).
    *   Constructs the `tools` object for the AI SDK's `streamText` function using the `toolName`, `description`, `schema`, and `execute` properties from the definitions.
    *   Handles the AI SDK's backend logic.

2.  **Client-Side Setup (`/app/mcpc-client-setup.ts`)**
    *   Imports the same `MCPCDefinition`s.
    *   Calls `registerMcpcDefinition` for each one to populate the client-side registry.
    *   This file is imported once in the main layout or page.

3.  **Chat Page (`/app/page.tsx`)**
    *   Uses the `useChat` hook from `ai/react`.
    *   Maps over the `messages` array.
    *   For each message where `role === 'tool'`, it renders the `<McpcMessageRenderer />`.
    *   Implements the `handleMcpcAction` callback to `append` new messages to the chat, triggering subsequent AI tool calls.

## Acceptance Criteria

-   A Next.js application is created that demonstrates the full conversational loop.
-   The user can type a message that causes the AI to call a tool.
-   The `McpcMessageRenderer` correctly renders the UI for the tool result.
-   The user can interact with the rendered UI (e.g., click a button) to trigger a new tool call.
-   The application is well-documented and serves as the primary reference for users.
