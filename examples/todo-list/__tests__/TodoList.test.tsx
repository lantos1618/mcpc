import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoList from '../TodoList';
import { TodoList as TodoListType } from '../types';

describe('TodoList', () => {
  const mockOnAction = vi.fn();
  const mockData: TodoListType = {
    todos: [
      { id: '1', text: 'Test Todo 1', completed: false, createdAt: new Date().toISOString() },
      { id: '2', text: 'Test Todo 2', completed: true, createdAt: new Date().toISOString() },
    ],
    filter: 'all',
    activeCount: 1,
    completedCount: 1,
  };

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('renders todos correctly', () => {
    render(<TodoList data={mockData} onAction={mockOnAction} />);
    
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('1 items left')).toBeInTheDocument();
  });

  it('allows adding a new todo', () => {
    render(<TodoList data={mockData} onAction={mockOnAction} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);
    
    expect(mockOnAction).toHaveBeenCalledWith('addTodo', {
      type: 'add',
      text: 'New Todo',
    });
  });

  it('toggles todo completion', () => {
    render(<TodoList data={mockData} onAction={mockOnAction} />);
    
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    
    expect(mockOnAction).toHaveBeenCalledWith('toggleTodo', {
      type: 'toggle',
      id: '1',
    });
  });

  it('deletes a todo', () => {
    render(<TodoList data={mockData} onAction={mockOnAction} />);
    
    const deleteButton = screen.getAllByText('×')[0];
    fireEvent.click(deleteButton);
    
    expect(mockOnAction).toHaveBeenCalledWith('deleteTodo', {
      type: 'delete',
      id: '1',
    });
  });

  it('filters todos', () => {
    render(<TodoList data={mockData} onAction={mockOnAction} />);
    
    const activeFilter = screen.getByText('Active');
    fireEvent.click(activeFilter);
    
    expect(mockOnAction).toHaveBeenCalledWith('setFilter', {
      type: 'setFilter',
      filter: 'active',
    });
  });

  it('clears completed todos', () => {
    render(<TodoList data={mockData} onAction={mockOnAction} />);
    
    const clearButton = screen.getByText('Clear completed');
    fireEvent.click(clearButton);
    
    expect(mockOnAction).toHaveBeenCalledWith('clearCompleted', {
      type: 'clearCompleted',
    });
  });
});
