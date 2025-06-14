'use client';

import { useState } from 'react';
import { MCPCRenderProps } from '@mcpc/core';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  activeCount: number;
  completedCount: number;
}

export type TodoActionParams =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'clearCompleted' }
  | { type: 'setFilter'; filter: 'all' | 'active' | 'completed' };

export default function TodoList({
  data,
  onAction,
}: MCPCRenderProps<TodoListProps, TodoActionParams>) {
  const [newTodoText, setNewTodoText] = useState('');
  const { todos, filter, activeCount, completedCount } = data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAction('addTodo', { type: 'add', text: newTodoText });
      setNewTodoText('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Todo List</h2>
      
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => onAction('setFilter', { type: 'setFilter', filter: 'all' })}
          className={`px-3 py-1 rounded ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onAction('setFilter', { type: 'setFilter', filter: 'active' })}
          className={`px-3 py-1 rounded ${
            filter === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onAction('setFilter', { type: 'setFilter', filter: 'completed' })}
          className={`px-3 py-1 rounded ${
            filter === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li 
            key={todo.id}
            className={`flex items-center p-3 rounded-lg ${
              todo.completed 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                : 'bg-white dark:bg-gray-800 shadow-md'
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onAction('toggleTodo', { type: 'toggle', id: todo.id })}
              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <span 
              className={`ml-3 flex-1 ${
                todo.completed ? 'line-through' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => onAction('deleteTodo', { type: 'delete', id: todo.id })}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-center py-4 text-gray-500 dark:text-gray-400">
            No todos found. Add one above!
          </li>
        )}
      </ul>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>{activeCount} items left</span>
        {completedCount > 0 && (
          <button
            onClick={() => onAction('clearCompleted', { type: 'clearCompleted' })}
            className="text-blue-500 hover:underline"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
