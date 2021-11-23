<script>
  export let notes;
  export let sources;
  export let acronym;
</script>

<div class="s-q-item__footer">
  {#if notes}
    <div class="s-q-item__footer__notes">{notes}</div>
  {/if}
  <div class="s-q-item__footer__details">
    {#if sources && sources.length > 0}
      <div class="s-q-item__footer__sources">
        {#if sources.length > 1}Quellen:{:else}Quelle:{/if}
        {#each sources as source, index}
          {#if source.text !== ""}
            {#if source.link && source.link.url && source.link.isValid}<a
                href={source.link.url}
                target="blank"
                rel="noopener noreferrer">{source.text}</a
              >{:else}{source.text}{/if}{#if index !== sources.length - 1 && sources[index + 1] !== ""},&nbsp;{/if}{/if}
        {/each}
      </div>
    {/if}
    {#if acronym}
      <div class="s-q-item__footer__acronym">NZZ / {acronym}</div>
    {:else}
      <div class="s-q-item__footer__acronym">NZZ</div>
    {/if}
  </div>
</div>
