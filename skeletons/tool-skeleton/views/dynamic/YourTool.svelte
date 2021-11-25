<script>
  // TODO: Rename 'YourTool.svelte' to '<Tool-Name>.svelte' & change all references
  let isWorkingLabel = "";
  let i = 0;

  function worksOnClick() {
    i++;
    isWorkingLabel = i < 5 ? "is working!" : "is still working!";
  }
</script>

<!-- Client side code is written/imported inside this component (e.g. Client interaction components) -->
<div class="s-font-title">
  Client-Side code
  <span class="your-tool__is-working-label">{isWorkingLabel}</span>
</div>
<button class="s-button s-button--small" on:click={worksOnClick}>
  Click me!
</button>
