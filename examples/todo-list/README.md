# Todo List MCPC Component

A fully interactive Todo List component built with MCPC (Model Context Protocol Components). This example demonstrates how to create a rich, interactive UI component that can be controlled by an AI model.

## Features

- Add new todos
- Toggle todo completion
- Delete todos
- Filter todos (all/active/completed)
- Clear completed todos
- Responsive design with clean UI

## Project Structure

```
todo-list/
├── README.md           # This file
├── client.ts          # Client-side registration
├── server.ts          # Server-side logic and MCPC definition
├── TodoList.tsx       # React component
└── types.ts           # TypeScript types and schemas
```

## Usage

### 1. Server-Side (API Route)

```typescript
import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import TodoListMCPC from './todo-list/server';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  return streamText({
    model: yourModel, // Your AI model
    messages,
    tools: {
      [TodoListMCPC.toolName]: {
        description: TodoListMCPC.description,
        parameters: TodoListMCPC.schema,
        execute: TodoListMCPC.execute,
      },
    },
  });
}
```

### 2. Client-Side (React Component)

```typescript
'use client';

import { useChat } from 'ai/react';
import { McpcMessageRenderer } from '@mcpc/react';
import './todo-list/client'; // Import to register the component

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <McpcMessageRenderer
              message={message}
              onMcpcAction={(action) => {
                // Handle MCPC actions
                console.log('Action:', action);
              }}
            />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## Styling

The component includes built-in styling using CSS-in-JS. You can customize the appearance by overriding the provided styles in the `TodoList.tsx` file.

## Development

To develop this component locally:

1. Clone the repository
2. Install dependencies: `bun install`
3. Start the development server: `bun run dev`
4. Open your browser to `http://localhost:3000`

## License

MIT
