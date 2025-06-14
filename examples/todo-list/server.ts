import { createMCPC } from '@mcpc/core';
import { z } from 'zod';
import { TodoList, Todo, TodoActionParams, TodoListSchema } from './types';

// In-memory store for demo purposes
let todos: Todo[] = [];

// Initialize with some sample todos
if (todos.length === 0) {
  const now = new Date().toISOString();
  todos = [
    { id: '1', text: 'Learn MCPC', completed: false, createdAt: now },
    { id: '2', text: 'Build a sample app', completed: true, createdAt: now },
  ];
}

// Helper function to filter todos based on the current filter
function getFilteredTodos(todos: Todo[], filter: 'all' | 'active' | 'completed'): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

// MCPC Definition for the TodoList
const TodoListMCPC = createMCPC({
  toolName: 'todo.list',
  description: 'A todo list component that allows adding, toggling, and removing todos',
  
  // Input schema for the tool
  schema: z.object({
    filter: z.enum(['all', 'active', 'completed']).optional().default('all'),
  }),

  // Server-side execution
  execute: async ({ filter = 'all' } = {}) => {
    return {
      todos: getFilteredTodos(todos, filter as 'all' | 'active' | 'completed'),
      filter,
    };
  },

  // UI component will be provided by the client
  uiComponent: null as any, // Will be set by the client

  // Client-side data transformation
  dataTransformer: (data) => ({
    ...data,
    activeCount: data.todos.filter(todo => !todo.completed).length,
    completedCount: data.todos.filter(todo => todo.completed).length,
  }),

  // Client-side action handlers
  uiActions: {
    // Add a new todo
    addTodo: {
      type: 'mcpToolRedirect',
      mcpToolName: 'todo.add',
      mapParams: ({ text }: { text: string }) => ({ text }),
    },
    
    // Toggle todo completion
    toggleTodo: {
      type: 'mcpToolRedirect',
      mcpToolName: 'todo.toggle',
      mapParams: ({ id }: { id: string }) => ({ id }),
    },
    
    // Delete a todo
    deleteTodo: {
      type: 'mcpToolRedirect',
      mcpToolName: 'todo.delete',
      mapParams: ({ id }: { id: string }) => ({ id }),
    },
    
    // Clear completed todos
    clearCompleted: {
      type: 'mcpToolRedirect',
      mcpToolName: 'todo.clearCompleted',
      mapParams: () => ({}),
    },
    
    // Set the current filter
    setFilter: {
      type: 'mcpToolRedirect',
      mcpToolName: 'todo.setFilter',
      mapParams: ({ filter }: { filter: 'all' | 'active' | 'completed' }) => ({ filter }),
    },
  },
});

// Export the MCPC definition
export default TodoListMCPC;
