import React from 'react';
import { getMcpcDefinition, type MCPCDefinition, type MCPCRenderProps, type MCPToolRedirectAction, type ClientExecutionAction } from '@mcpc/core';

// Assuming a Message type similar to Vercel AI SDK. 
// This might need to be imported or defined more robustly.
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string | any; // Content can be string or tool result object
  name?: string; // Tool name, present if role is 'tool' or assistant wants to call a tool
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string; // JSON string of arguments
    };
  }>;
  // For tool results, Vercel AI SDK uses `tool_call_id` and `name` on the message itself when role is 'tool'
  tool_call_id?: string; 
}

export interface McpcMessageRendererProps {
  message: Message;
  onMcpcAction?: (actionDetails: { toolToCall: string; params: any }) => void;
  // Potentially, a map of custom components to render non-MCPC messages, or loading/error states
  customRenderers?: {
    renderUserMessage?: (message: Message) => React.ReactNode;
    renderAssistantMessage?: (message: Message) => React.ReactNode;
    renderLoading?: () => React.ReactNode;
    renderError?: (error: Error) => React.ReactNode;
  };
}

export const McpcMessageRenderer: React.FC<McpcMessageRendererProps> = ({ 
  message,
  onMcpcAction,
  customRenderers 
}) => {

  if (message.role === 'tool') {
    if (!message.name) {
      console.error('McpcMessageRenderer: Message with role "tool" is missing a name.', message);
      return customRenderers?.renderError?.(new Error('Tool message missing name')) || <div style={{color: 'red'}}>Error: Tool message invalid</div>;
    }

    const mcpcDefinition = getMcpcDefinition(message.name) as MCPCDefinition<any, any, any, any, any, any> | undefined;

    if (!mcpcDefinition) {
      console.warn(`McpcMessageRenderer: No MCPCDefinition found for tool "${message.name}". Rendering raw content.`);
      return (
        <div className="mcpc-raw-tool-result">
          <strong>Tool Result ({message.name}):</strong>
          <pre>{typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)}</pre>
        </div>
      );
    }

    const { uiComponent: UiComponent, dataTransformer, uiActions, clientExecute } = mcpcDefinition;
    let displayData: any;

    try {
      const toolResult = typeof message.content === 'string' ? JSON.parse(message.content) : message.content;
      displayData = dataTransformer ? dataTransformer(toolResult) : toolResult;
    } catch (e: any) {
      console.error(`McpcMessageRenderer: Error transforming data for tool "${message.name}":`, e);
      return customRenderers?.renderError?.(e) || <div style={{color: 'red'}}>Error transforming data for {message.name}</div>;
    }

    const handleInternalAction = (actionName: string, params: any) => {
      if (!uiActions || !uiActions[actionName]) {
        console.warn(`McpcMessageRenderer: No uiAction defined for action "${actionName}" in MCPC "${mcpcDefinition.toolName}"`);
        return;
      }

      const actionDefinition = uiActions[actionName];

      if (actionDefinition.type === 'mcpToolRedirect') {
        const redirectAction = actionDefinition as MCPToolRedirectAction<any, any>;
        const mappedParams = redirectAction.mapParams ? redirectAction.mapParams(params) : params;
        if (onMcpcAction) {
          onMcpcAction({ toolToCall: redirectAction.mcpToolName, params: mappedParams });
        } else {
          console.warn(`McpcMessageRenderer: onMcpcAction prop is not provided, but MCPC "${mcpcDefinition.toolName}" tried to call another tool "${redirectAction.mcpToolName}".`);
        }
      } else if (actionDefinition.type === 'clientExecute') {
        const clientAction = actionDefinition as ClientExecutionAction<any, any>;
        if (clientExecute && clientExecute[clientAction.clientExecuteName]) {
          const mappedArgs = clientAction.mapParams ? clientAction.mapParams(params) : params;
          try {
            clientExecute[clientAction.clientExecuteName](mappedArgs);
          } catch (e: any) {
            console.error(`McpcMessageRenderer: Error executing client function "${clientAction.clientExecuteName}" for MCPC "${mcpcDefinition.toolName}":`, e);
          }
        } else {
          console.warn(`McpcMessageRenderer: No clientExecute function found for "${clientAction.clientExecuteName}" in MCPC "${mcpcDefinition.toolName}".`);
        }
      }
    };

    return <UiComponent data={displayData} onAction={handleInternalAction} />;
  }

  // Handle other message roles (user, assistant) or provide default rendering
  if (message.role === 'user') {
    return customRenderers?.renderUserMessage?.(message) || (
      <div className="mcpc-user-message">
        {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
      </div>
    );
  }

  if (message.role === 'assistant') {
    // Assistant message might contain text content or a desire to call a tool (tool_calls)
    let assistantContent = null;
    if (typeof message.content === 'string' && message.content.trim().length > 0) {
      assistantContent = customRenderers?.renderAssistantMessage?.(message) || (
        <div className="mcpc-assistant-message">
          {message.content}
        </div>
      );
    }

    // Render tool calls if present (this is informational, actual execution is handled by AI SDK)
    const toolCallsContent = message.tool_calls?.map(toolCall => (
      <div key={toolCall.id} className="mcpc-assistant-tool-call-request" style={{fontStyle: 'italic', opacity: 0.8, marginTop: '4px'}}>
        Assistant wants to call: {toolCall.function.name}({toolCall.function.arguments})
      </div>
    ));

    if (assistantContent || (toolCallsContent && toolCallsContent.length > 0)) {
      return <>
        {assistantContent}
        {toolCallsContent}
      </>;
    }
    return null; // Or some placeholder if assistant message is empty and has no tool_calls
  }

  // Fallback for unknown message roles or types
  return customRenderers?.renderError?.(new Error(`Unknown message role: ${message.role}`)) || (
    <div style={{color: 'orange'}}>Unsupported message type: {message.role}</div>
  );
}; 