import React, { useState } from 'react';
import { MCPCRenderProps } from '@mcpc/core';
import { TodoList, TodoActionParams } from './types';

const TodoListComponent: React.FC<MCPCRenderProps<TodoList, TodoActionParams>> = ({
  data,
  onAction,
}) => {
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
    <div className="todo-app">
      <header>
        <h1>Todo List</h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>
      </header>

      <div className="filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onAction('setFilter', { type: 'setFilter', filter: 'all' })}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          onClick={() => onAction('setFilter', { type: 'setFilter', filter: 'active' })}
        >
          Active
        </button>
        <button
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => onAction('setFilter', { type: 'setFilter', filter: 'completed' })}
        >
          Completed
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onAction('toggleTodo', { type: 'toggle', id: todo.id })}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => onAction('deleteTodo', { type: 'delete', id: todo.id })}
              className="delete-button"
              aria-label="Delete todo"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="todo-footer">
        <span>{activeCount} items left</span>
        {completedCount > 0 && (
          <button
            onClick={() => onAction('clearCompleted', { type: 'clearCompleted' })}
            className="clear-completed"
          >
            Clear completed
          </button>
        )}
      </div>

      <style jsx>{`
        .todo-app {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .todo-form {
          display: flex;
          margin-bottom: 20px;
        }
        .todo-input {
          flex: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
        }
        .add-button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }
        .add-button:hover {
          background-color: #45a049;
        }
        .filters {
          margin-bottom: 20px;
        }
        .filter-button {
          background: none;
          border: 1px solid #ddd;
          padding: 5px 10px;
          margin-right: 5px;
          cursor: pointer;
          border-radius: 3px;
        }
        .filter-button.active {
          background-color: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }
        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }
        .todo-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border: 1px solid #eee;
          margin-bottom: 5px;
          border-radius: 4px;
        }
        .todo-item.completed .todo-text {
          text-decoration: line-through;
          color: #888;
        }
        .todo-checkbox {
          margin-right: 10px;
        }
        .todo-text {
          flex: 1;
        }
        .delete-button {
          background: none;
          border: none;
          color: #ff4444;
          font-size: 20px;
          cursor: pointer;
          opacity: 0.7;
        }
        .delete-button:hover {
          opacity: 1;
        }
        .todo-footer {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 14px;
        }
        .clear-completed {
          background: none;
          border: none;
          color: #666;
          text-decoration: underline;
          cursor: pointer;
        }
        .clear-completed:hover {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default TodoListComponent;
