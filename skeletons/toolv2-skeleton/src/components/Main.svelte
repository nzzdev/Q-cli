<script lang="ts">
import type { [ToolName]SvelteProperties } from '@src/interfaces';

// You must type it expclitly to have no lint errors.
export let componentProps: [ToolName]SvelteProperties;

// Extract const heres.
const { config, displayOptions, id } = componentProps;

// Extract dynamic using let instead of cost.
// let { dynProp } = componentProps;

function shouldShowTitle(): boolean {
  if (typeof displayOptions.hideTitle === 'boolean') {
    return !displayOptions.hideTitle;
  }

  return true;
}
</script>

<div {id} class="s-q-item">
  {#if shouldShowTitle()}
    <h3 class="s-q-item__title">{config.title}</h3>
  {/if}

  {#if config.subtitle && config.subtitle !== ''}
    <div class="s-q-item__subtitle">{config.subtitle}</div>
  {/if}

  Your first [Tool-name]!
</div>
