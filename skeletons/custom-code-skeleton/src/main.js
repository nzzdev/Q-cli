import App from "./App.svelte";
import "./main.scss";

const app = new App({
  target: document.querySelector("#container"),
  props: {
    name: "custom-code-skeleton",
  },
});

export default app;
