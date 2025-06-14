import { type MCPCDefinition } from './types';
import { type ZodTypeAny } from 'zod';

// The type for the registry map. It maps toolName (string) to an MCPCDefinition.
// Using 'any' for the generic arguments of MCPCDefinition here because the registry
// will store definitions with various specific types.
const mcpcRegistry = new Map<string, MCPCDefinition<ZodTypeAny, any, any, any, any, any>>();

/**
 * Registers an MCPCDefinition in the client-side registry.
 * If a definition with the same toolName already exists, it will be overwritten.
 *
 * @param definition - The MCPCDefinition to register.
 */
export function registerMcpcDefinition(
  definition: MCPCDefinition<ZodTypeAny, any, any, any, any, any>
): void {
  if (!definition || !definition.toolName) {
    console.error('MCPC Definition or toolName is missing. Cannot register.', definition);
    return;
  }
  mcpcRegistry.set(definition.toolName, definition);
}

/**
 * Retrieves an MCPCDefinition from the client-side registry by its toolName.
 *
 * @param toolName - The unique name of the MCPC tool to retrieve.
 * @returns The MCPCDefinition if found, otherwise undefined.
 */
export function getMcpcDefinition(
  toolName: string
): MCPCDefinition<ZodTypeAny, any, any, any, any, any> | undefined {
  if (!toolName) {
    console.error('toolName is missing. Cannot retrieve MCPC Definition.');
    return undefined;
  }
  return mcpcRegistry.get(toolName);
}

/**
 * Clears all MCPCDefinitions from the registry.
 * Useful for testing or resetting state.
 */
export function clearMcpcRegistry(): void {
  mcpcRegistry.clear();
}

/**
 * Gets all registered MCPCDefinitions.
 * Useful for debugging or introspection.
 * @returns A map of all registered MCPCDefinitions.
 */
export function getAllMcpcDefinitions(): ReadonlyMap<string, MCPCDefinition<ZodTypeAny, any, any, any, any, any>> {
    return mcpcRegistry;
} 