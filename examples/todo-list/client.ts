import { registerMcpcDefinition } from '@mcpc/core';
import TodoListComponent from './TodoList';
import TodoListMCPC from './server';

// Register the TodoList component with the MCPC registry
const TodoListMCPCWithUI = {
  ...TodoListMCPC,
  uiComponent: TodoListComponent,
};

// Register the component
registerMcpcDefinition(TodoListMCPCWithUI);

// Export for manual registration if needed
export default TodoListMCPCWithUI;
