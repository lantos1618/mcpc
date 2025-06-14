import React from 'react';
import { z } from 'zod';
import { createMCPC, type MCPCRenderProps, type MCPCDefinition } from '@mcpc/core';

// 1. Define the schema for the parameters the LLM will use to call this tool.
const SimpleTextParamsSchema = z.object({
  textToDisplay: z.string().describe('The text content that needs to be displayed to the user.'),
});

// 2. Define the shape of the data that the UI component will receive.
export interface SimpleTextData {
  displayText: string;
}

// 3. Define the UI component.
const SimpleTextDisplayComponent: React.FC<MCPCRenderProps<SimpleTextData, never>> = function SimpleTextDisplayComponentFunc({ data }) {
  return (
    <div className="mcpc-simple-text" style={{ padding: '10px', margin: '5px', border: '1px dashed #ccc', borderRadius: '4px' }}>
      <p>{data.displayText}</p>
    </div>
  );
};

// 4. Define the MCPCDefinition using createMCPC.
export const SimpleTextDisplayMCPC: MCPCDefinition<
  typeof SimpleTextParamsSchema, // Schema for LLM tool call
  z.infer<typeof SimpleTextParamsSchema>, // Result of the execute function (server-side)
  SimpleTextData, // Data type for the UI component
  never // Type for UI action parameters (not used here)
> = createMCPC({
  toolName: 'ui.displaySimpleText',
  description: 'Displays a simple text message to the user. Use this when you need to present a piece of information as plain text.',
  schema: SimpleTextParamsSchema,
  
  execute: async (params) => {
    // For a simple display component, the server execute function
    // might just return the parameters it received, or a slightly transformed version.
    // Here, we directly return the params, as the dataTransformer will shape it for the UI.
    return params;
  },

  uiComponent: SimpleTextDisplayComponent,

  dataTransformer: (toolResult) => {
    // The toolResult here is the output of the `execute` function.
    // We transform it into the SimpleTextData shape required by SimpleTextDisplayComponent.
    return {
      displayText: toolResult.textToDisplay,
    };
  },

  // No uiActions or clientExecute needed for this simple display-only component.
  // uiActions: {},
  // clientExecute: {},
}); 