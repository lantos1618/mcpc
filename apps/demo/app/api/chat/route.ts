import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
 
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  // Ask OpenAI for a streaming chat completion
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that helps users manage their todo lists.
        You can create, update, and delete todos.
        When the user asks about their todos, respond with a tool call to 'todo.list'.
        Keep your responses concise and helpful.`,
      },
      ...messages,
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'todo.list',
          description: 'Get the current list of todos',
          parameters: {
            type: 'object',
            properties: {
              filter: {
                type: 'string',
                enum: ['all', 'active', 'completed'],
                description: 'Filter todos by status',
              },
            },
          },
        },
      },
    ],
    tool_choice: 'auto',
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
