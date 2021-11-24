<script>
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";

  export let item;
  export let id;
  export let displayOptions;
</script>

<!-- Static code is written/imported inside 'q-item-container' (e.g. Header, Title components) -->
<div class="q-item-container">
  {#if !displayOptions.hideTitle}
    <Header title={item.title} />
    {#if item.subtitle}
      <div class="s-q-item__subtitle s-font-note">{item.subtitle}</div>
    {/if}
  {/if}
  <!-- TODO: Rename 'q-your-tool-container' to 'q-<tool-name>-container' & change all references -->
  <div id="{id}_container" class="q-your-tool-container" />
  <Footer notes={item.notes} sources={item.sources} acronym={item.acronym} />
</div>
