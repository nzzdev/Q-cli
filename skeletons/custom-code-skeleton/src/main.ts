import App from './App.svelte';
import './main.scss';

const app = new App({
  target: document.querySelector('#custom-code-fw'),
  props: {
    name: 'custom-code-skeleton - Fullwidth',
  },
});

new App({
  target: document.querySelector('#custom-code-cw'),
  props: {
    name: 'custom-code-skeleton - Content Width',
  },
});

export default app;
