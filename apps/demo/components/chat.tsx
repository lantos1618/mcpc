'use client';

import { useChat } from 'ai/react';
import { McpcMessageRenderer } from '@mcpc/react';
import { useEffect } from 'react';
import { registerMcpcDefinition } from '@mcpc/core';
import TodoList from './todo-list';

// Register the TodoList MCPC component
const TodoListMCPC = {
  toolName: 'todo.list',
  description: 'A todo list component',
  schema: {
    type: 'object',
    properties: {
      filter: { type: 'string', enum: ['all', 'active', 'completed'] },
    },
    required: [],
  },
  execute: async ({ filter = 'all' } = {}) => {
    return {
      todos: [],
      filter,
      activeCount: 0,
      completedCount: 0,
    };
  },
  uiComponent: TodoList,
};

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: '/api/chat',
  });

  // Register MCPC components on mount
  useEffect(() => {
    registerMcpcDefinition(TodoListMCPC);
  }, []);

  const handleAction = (action: { toolToCall: string; params: any }) => {
    // Handle MCPC actions here
    console.log('Action:', action);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <McpcMessageRenderer
                message={message}
                onMcpcAction={handleAction}
              />
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
          value={input}
          placeholder="Type a message..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={() =>
            append({
              role: 'user',
              content: 'Show me my todo list',
            })
          }
          className="text-sm text-blue-500 hover:underline"
        >
          Show Todo List
        </button>
      </div>
    </div>
  );
}
