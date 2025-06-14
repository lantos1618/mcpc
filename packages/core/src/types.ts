import type React from 'react';
import { z, type ZodTypeAny } from 'zod';

/**
 * Props for the React component used to render the MCPC.
 * @template TUIData - The type of the data object passed to the UI component.
 * @template TUIActionParams - The type of the parameters passed when an action is triggered from the UI component.
 */
export interface MCPCRenderProps<TUIData, TUIActionParams> {
  data: TUIData;
  onAction: (actionName: string, params: TUIActionParams) => void;
}

/**
 * Defines an action that redirects to another MCPC tool call.
 * @template TUIActionParams - The type of parameters received from the UI component's onAction callback.
 * @template TMappedParamsForNextTool - The type of parameters mapped for the target MCPC tool.
 */
export interface MCPToolRedirectAction<TUIActionParams, TMappedParamsForNextTool> {
  type: 'mcpToolRedirect';
  mcpToolName: string;
  mapParams: (uiActionParams: TUIActionParams) => TMappedParamsForNextTool;
}

/**
 * Defines an action that executes a client-side function.
 * @template TUIActionParams - The type of parameters received from the UI component's onAction callback.
 * @template TClientFuncArgs - The type of arguments for the client-side function.
 */
export interface ClientExecutionAction<TUIActionParams, TClientFuncArgs> {
  type: 'clientExecute';
  clientExecuteName: string;
  mapParams: (uiActionParams: TUIActionParams) => TClientFuncArgs;
}

/**
 * The main definition for an MCPC (Model Context Protocol Component).
 * This interface bundles all aspects of an AI-interactive component.
 *
 * @template TParamsSchema - Zod schema for the tool's input parameters. Used by the LLM and for validation.
 * @template TExecuteResult - Result type of the server-side 'execute' function.
 * @template TUIData - Data type for the 'uiComponent'. This is often transformed from TExecuteResult by the dataTransformer.
 * @template TUIActionParams - Type of parameters passed from the 'uiComponent.onAction' callback.
 * @template TClientFuncArgs - Argument type for functions defined in the 'clientExecute' map. Defaults to 'any'.
 * @template TClientFuncResult - Result type for functions defined in the 'clientExecute' map. Defaults to 'void'.
 */
export interface MCPCDefinition<
  TParamsSchema extends ZodTypeAny,
  TExecuteResult,
  TUIData,
  TUIActionParams,
  TClientFuncArgs = any,
  TClientFuncResult = void
> {
  /** A unique identifier for the tool (e.g., `weather.getCurrentWeather`, `com.example/user.profile`). */
  toolName: string;

  /** A description for the LLM to understand the tool's purpose. */
  description: string;

  /** The Zod schema for the tool's input parameters. */
  schema: TParamsSchema;

  /** 
   * Server-side function to be executed when the LLM calls the tool.
   * @param params - The parameters for the tool, conforming to TParamsSchema.
   * @returns A promise resolving to the execution result.
   */
  execute: (params: z.infer<TParamsSchema>) => Promise<TExecuteResult>;

  /** The React component used to render the tool's result or other data. */
  uiComponent: React.FC<MCPCRenderProps<TUIData, TUIActionParams>>;

  /**
   * Optional client-side function to transform raw tool execution results 
   * into props suitable for the `uiComponent`. If not provided, TExecuteResult is assumed to be compatible with TUIData.
   * @param toolResult - The result from the 'execute' function.
   * @returns The transformed data for the UI component.
   */
  dataTransformer?: (toolResult: TExecuteResult) => TUIData;

  /**
   * Optional client-side mapping of named UI interactions (triggered by `uiComponent.onAction`)
   * to either initiate a new MCP tool call or execute a client-side function.
   * Each key is an action name (string) that `uiComponent.onAction` can emit.
   * The value defines how the action is handled.
   */
  uiActions?: Record<
    string,
    | MCPToolRedirectAction<TUIActionParams, any> // 'any' for TMappedParamsForNextTool as it varies per target tool
    | ClientExecutionAction<TUIActionParams, TClientFuncArgs>
  >;

  /**
   * Optional client-side functions that can be triggered by `uiActions` (specifically by `ClientExecutionAction`).
   * These are for purely frontend interactions that do not require an LLM roundtrip.
   * Each key corresponds to a `clientExecuteName` in a `ClientExecutionAction`.
   * @param args - The arguments for the client function, mapped by `ClientExecutionAction.mapParams`.
   * @returns The result of the client-side function.
   */
  clientExecute?: Record<string, (args: TClientFuncArgs) => TClientFuncResult>;
} 