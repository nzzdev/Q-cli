# Q cli

run `npm install -g @nzz/q-cli` to install the `Q` cli helping you with developing Q tools.

## To start

```bash
nvm use
npm install
node index.js
```

Default port of this node application is 5000 and can be overwritten by using `PORT` as environment variable when starting the node app: 
```bash
PORT=4001 node index.js
``` 
Default base url of the tool your are currently developing is `http://localhost:3000`, this can also be changed by passing the environment variable `TOOL_BASE_URL`.

## To use

One can access dev view via endpoint `/dev`. Fixture data can be selected at dev view.

- Target: one can change the target in function `loadRenderingInfo` in `index.html`
- Sophie modules: one can comment sophie modules not needed in `targetConfig.js`