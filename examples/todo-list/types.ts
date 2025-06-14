import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1, 'Todo text is required'),
  completed: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodoListSchema = z.object({
  todos: z.array(TodoSchema),
  filter: z.enum(['all', 'active', 'completed']).default('all'),
});

export type TodoList = z.infer<typeof TodoListSchema>;

export type TodoActionParams =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'clearCompleted' }
  | { type: 'setFilter'; filter: 'all' | 'active' | 'completed' };

export const TodoActionSchema = z.union([
  z.object({
    type: z.literal('add'),
    text: z.string().min(1, 'Todo text is required'),
  }),
  z.object({
    type: z.literal('toggle'),
    id: z.string().uuid(),
  }),
  z.object({
    type: z.literal('delete'),
    id: z.string().uuid(),
  }),
  z.object({
    type: z.literal('clearCompleted'),
  }),
  z.object({
    type: z.literal('setFilter'),
    filter: z.enum(['all', 'active', 'completed']),
  }),
]);
