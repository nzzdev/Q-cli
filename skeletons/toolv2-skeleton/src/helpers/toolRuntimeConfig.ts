import type { ToolRuntimeConfig } from '../interfaces.js';

export default function getExactPixelWidth(toolRuntimeConfig: ToolRuntimeConfig): number | undefined {
  if (!toolRuntimeConfig.size || !Array.isArray(toolRuntimeConfig.size.width)) {
    return undefined;
  }

  for (const width of toolRuntimeConfig.size.width) {
    if (width && width.value && width.comparison === '=' && (!width.unit || width.unit === 'px')) {
      return width.value;
    }
  }

  return undefined;
}
