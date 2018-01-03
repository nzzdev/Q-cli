# Q cli

run `npm install -g @nzz/q-cli` to install the `Q` cli helping you with developing Q tools.

## To start

```bash
nvm use
npm install
Q server
```

Default port of this node application is 5000 and can be overwritten by using `-p` or `--port` as option while starting Q dev server: 
```bash
Q server -p 4001
``` 

Default base url of the tool your are currently developing is `http://localhost:3000`, this can also be changed by passing the option `-b` or `--tool-base-url` while starting Q dev server.
```bash
Q server -b http://localhost:4000
```

## To use

One can access dev view via endpoint `/dev`. Fixture data can be selected at dev view.

- Target is set by starting Q dev server, default is `nzz_ch` and can be overwritten by passing the target with option `-t` or `--target`, e.g.
```bash
Q server -t nzzas
```

- Sophie modules: all available sophie modules are loaded dependent on the target specified. If a tool should be tested only with very specific selection of sophie modules one can comment not needed sophie modules in `targetConfig.js`