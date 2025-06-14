import React from 'react';
import { z } from 'zod';
import { createMCPC, type MCPCRenderProps, type MCPCDefinition } from '@mcpc/core';

// New: Define schema for individual content items in a stream
const ContentItemSchema = z.union([
  z.string().describe("A block of plain text."),
  z.object({
    tool: z.string().describe("The name of the tool or type of object being represented."),
    details: z.record(z.unknown()).optional().describe("Structured details of the tool or object.")
  }).describe("A representation of a tool call or structured object.")
]);

// 1. Define the schema for the parameters.
const KeyValueParamsSchema = z.object({
  title: z.string().optional().describe('An optional title for the key-value pair display.'),
  pairs: z.array(
    z.object({
      key: z.string().describe('The key for the data point.'),
      value: z.union([
        z.string(),
        z.array(ContentItemSchema)
      ]).describe('The value for the data point, which can be a simple string or a stream of mixed text and tool/object representations.'),
    })
  ).describe('An array of key-value pairs to display, where values can be complex streams.'),
});

// New: Define the shape of individual content items for the UI.
export type ContentItemData =
  | string
  | { tool: string; details?: Record<string, unknown> };

// 2. Define the shape of the data for the UI component.
export interface KeyValueData {
  title?: string;
  items: Array<{
    key: string;
    value: string | ContentItemData[]; // Value can be simple string or array of mixed items
  }>;
}

// 3. Define the UI component.
const KeyValuePairsDisplayComponent: React.FC<MCPCRenderProps<KeyValueData, never>> = ({ data }) => {
  const renderContentItem = (contentItem: ContentItemData, index: number) => {
    if (typeof contentItem === 'string') {
      // Render plain text, ensuring white-space is respected for multi-line strings
      return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{contentItem}</span>;
    } else {
      // Render tool/object representation
      return (
        <div key={index} style={{ border: '1px dashed #ccc', padding: '5px', margin: '5px 0', backgroundColor: '#f9f9f9' }}>
          <strong style={{ display: 'block', marginBottom: '3px' }}>Tool/Object: {contentItem.tool}</strong>
          {contentItem.details && (
            <pre style={{ margin: 0, fontSize: '0.9em', backgroundColor: '#efefef', padding: '4px', borderRadius: '3px', overflowX: 'auto' }}>
              {JSON.stringify(contentItem.details, null, 2)}
            </pre>
          )}
        </div>
      );
    }
  };

  return (
    <div className="mcpc-key-value-pairs" style={{ padding: '10px', margin: '5px', border: '1px solid #eee', borderRadius: '4px', fontFamily: 'sans-serif' }}>
      {data.title && <h4 style={{ marginTop: 0, marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{data.title}</h4>}
      <dl style={{ margin: 0 }}>
        {data.items.map((item, index) => (
          <React.Fragment key={index}>
            <dt style={{ fontWeight: 'bold', marginBottom: '2px' }}>{item.key}</dt>
            <dd style={{ marginLeft: '20px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '2px solid #f0f0f0' }}>
              {typeof item.value === 'string'
                ? <span style={{ whiteSpace: 'pre-wrap' }}>{item.value}</span>
                : item.value.map(renderContentItem)}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};

// 4. Define the MCPCDefinition.
export const KeyValuePairsDisplayMCPC: MCPCDefinition<
  typeof KeyValueParamsSchema,
  z.infer<typeof KeyValueParamsSchema>,
  KeyValueData,
  never
> = createMCPC({
  toolName: 'ui.displayKeyValuePairs',
  description: 'Displays a list of key-value pairs. Useful for showing structured data, attributes, or properties.',
  schema: KeyValueParamsSchema,

  execute: async (params) => {
    return params; // Echo params, dataTransformer will handle shaping
  },

  uiComponent: KeyValuePairsDisplayComponent,

  dataTransformer: (toolResult) => {
    return {
      title: toolResult.title,
      items: toolResult.pairs,
    };
  },
}); 