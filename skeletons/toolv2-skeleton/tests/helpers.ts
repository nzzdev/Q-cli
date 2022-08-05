import type { AvailabilityResponseObject, RenderingInfo } from '@src/interfaces';

export function getMarkup(result: object | undefined): string {
  const casted = result as RenderingInfo;
  return casted.markup;
}

export function getScripts(result: object | undefined): {content: string}[] {
  const casted = result as RenderingInfo;
  return casted.scripts;
}

export function getStylesheets(result: object | undefined): {name: string}[] {
  const casted = result as RenderingInfo;
  return casted.stylesheets;
}

export function getAvailabilityResponse(result: object | undefined): boolean {
  const casted = result as AvailabilityResponseObject;
  return casted.available;
}
