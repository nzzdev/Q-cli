# Q cli

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

- Default config file is default.js. Tool/target specific stylesheets, scripts or toolRuntimeConfig can be specified there. Another config file name can be specified by using option `c` or `--config`. 
```bash
Q server -c config-file-name.js
``` 
This config file has to be stored in `config` folder as well and should follow the same basic structure like `default.js`:
```js
module.exports = {
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

```

## Creating new tool

Once `Q` cli installed one can create the skeleton of a new tool by executing
```bash
Q new-tool my-tool-name
```

- The directory name where the new tool is being created defaults to the tool name and can be overwritten by using option `-d` or `--dir`
```bash
Q new-tool my-tool-name -d my-tool-directory
```