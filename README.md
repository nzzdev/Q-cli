# Q cli

**Maintainer**: [manuelroth](https://github.com/manuelroth)

run `npm install -g @nzz/q-cli` to install the `Q` cli helping you with developing Q tools.

## Q dev server
Once `Q` cli installed one can start Q dev server by running:

```bash
Q server
```

With the Q dev server running one can now test a tool with fixture data. Of course the respective tool has to be started as well.

- Default port is 5000 and can be overwritten by using `-p` or `--port` as option while starting Q dev server: 
```bash
Q server -p 4001
``` 

- Default base url of the tool your are currently developing is `http://localhost:3000`, this can also be changed by passing the option `-b` or `--tool-base-url` while starting Q dev server.
```bash
Q server -b http://localhost:4000
```

- Default target is `nzz_ch` and can be overwritten by using `-t` or `--target`.
```bash
Q server -t your_target
```

- One can optionally specify a path to a config file by using option `-c` or `--config`, e.g. 
```bash
Q server -c ./config-file-name.js
``` 
A config file should export an async function returning a config object. The config object has to contain an object for each target. Target objects can contain 
- tool specific additionalRenderingInfo like additional stylesheets and scripts to load
- a target specific context which can also contain stylesheets, scripts or background information
- toolRuntimeConfig containing information which a tool might need at runtime
Config file example:
```js
async function getConfig() {
  return {
    nzz_ch: { // target name
      additionalRenderingInfo: { // additionalRenderingInfo is tool based
        stylesheets: [
          {
            url: 'https://service.sophie.nzz.ch/bundle/sophie-q@1,sophie-font@1,sophie-color@1,sophie-viz-color@1,sophie-input@1.css'
          }
        ]
      },
      context: { // context is target based
        stylesheets: [
          {
            url: 'https://context-service.st.nzz.ch/stylesheet/all/nzz.ch.css'
          }
        ],
        background: {
          color: '#fff'
        }
      },
      toolRuntimeConfig: {
        displayOptions: {
          hideTitle: true
        }
      }
    }
  }
}

module.exports = getConfig;
```
## Creating new Q server implementation

Once `Q` cli is installed one can create the skeleton of a Q server implementation by executing
```bash
Q new-server my-server-name
```
- The directory name where the server implementation is being created defaults to the server name and can be overwritten by using option `-d` or `--dir`
```bash
Q new-server my-server-name -d my-server-directory
```

## Creating new tool

Once `Q` cli is installed one can create the skeleton of a new tool by executing
```bash
Q new-tool my-tool-name
```

- The directory name where the new tool is being created defaults to the tool name and can be overwritten by using option `-d` or `--dir`
```bash
Q new-tool my-tool-name -d my-tool-directory
```
