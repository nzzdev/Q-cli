/**
 * These interface are the basic setup for your [Tool-name] to run.
 */

/**
 * What is received by your [Tool-name]'s backend.
 */
export interface WebPayload {
  item: [ToolName]Config;
  itemStateInDb: boolean;
  toolRuntimeConfig: ToolRuntimeConfig;
}

/**
 * The total config file.
 */
export interface [ToolName]Config {
  options: [ToolName]ConfigOptions;
  title: string;
  subtitle: string;
}

/**
 * Specific options for this Q-item.
 */
export interface [ToolName]ConfigOptions {
  showSearch: boolean;
}

export interface DisplayOptions {
  hideTitle?: boolean;
}

/**
 * Specific options set for this runtime.
 */
export interface ToolRuntimeConfig {
  displayOptions?: DisplayOptions;
  fileRequestBaseUrl: string;
  toolBaseUrl: string;
  id: string;
  size: {
    width: Array<{ value: number; unit: string; comparison: '=' | '>' | '<' | '>=' | '<=' }>;
  };
  isPure: boolean;
  requestId: string;
  markup?: string;
  noInteraction?: boolean;
}

/**
 * What is sent to the front-end.
 */
export interface RenderingInfo {
  polyfills: string[];
  stylesheets: Array<{ name: string }>;
  scripts: Array<{ content: string }>;
  markup: string;
}

/**
 * Standard interface for availability checks.
 */
export interface AvailabilityResponseObject {
  available: boolean;
}

/**
 * The config that you pass into your main svelte component.
 * This is the entry point of your interacte Q-item.
 */
export interface [ToolName]SvelteProperties {
  config: [ToolName]Config;
  displayOptions: DisplayOptions;
  noInteraction: boolean;
  id: string;
  width: number | undefined;
}

export interface StyleHashMap {
  main: string;
}
