/**
 * Put all fixture generators here.
 * Or if the file gets too big split them up to your liking.
 */
import type { DisplayOptions, [ToolName]Config, [ToolName]ConfigOptions, [ToolName]SvelteProperties } from '@src/interfaces';

export function create[ToolName]SveltePropertiesFixture(): [ToolName]SvelteProperties {
  const displayOptions = createDisplayOptionsFixture();

  return {
    config: create[ToolName]ConfigFixture(),
    displayOptions,
    id: 'id',
    noInteraction: false,
    width: 400,
  };
}

export function create[ToolName]ConfigFixture(): [ToolName]Config {
  return {
    options: create[ToolName]ConfigOptionsFixture(),
    title: 'title',
    subtitle: 'id',
  };
}

export function create[ToolName]ConfigOptionsFixture(): [ToolName]ConfigOptions {
  return {
    showSearch: true,
  };
}

export function createDisplayOptionsFixture(override: Partial<DisplayOptions> = {}): DisplayOptions {
  return {
    hideTitle: false,
    ...override,
  };
}
