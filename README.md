# Q cli [![Build Status](https://travis-ci.com/nzzdev/Q-cli.svg?branch=dev)](https://travis-ci.com/nzzdev/Q-cli)

**Maintainer**: [Nicolas Staub](https://github.com/fromdusttilldawn)

## Table of contents

- [Installation](#installation)
- [Development](#development)
- [Github Actions](#github-actions)
- [Functionality](#functionality)
- [License](#license)

## Installation

```bash
npm install -g @nzz/q-cli
```

## Development

```
git clone git@github.com:nzzdev/Q-cli.git
cd Q-cli
nvm use
npm install
```

For testing local changes of Q-cli, one can link the local package to the global installation of Q-cli:

```bash
cd Q-cli
npm link
```

Q commands will now use the local Q-cli.

To unlink, simply install Q-cli again globally:

```bash
npm install @nzz/q-cli -g
```

## Github actions

To use the q-cli in github actions there are special access tokens provided. You can find them in 1password (LivingDocs Public API Access Tokens).

There is an entire [thread](https://3.basecamp.com/3500782/buckets/1333707/documents/2903809795#__recording_3878674488) in basecamp on how this solution works.

Example code for a github action to update on all environments. You can check the functionality section if you only want to update a specific environment.

You will need to set the secrets in github unders **settings > secrets & variables > actions > New repository secret**

```
- name: Run Q cli
  run: Q update-item
  env:
    Q_STAGING_SERVER: ${{ secrets.Q_STAGING_SERVER }}
    Q_STAGING_ACCESSTOKEN: ${{ secrets.Q_STAGING_ACCESSTOKEN }}
    Q_PRODUCTION_SERVER: ${{ secrets.Q_PRODUCTION_SERVER }}
    Q_PRODUCTION_ACCESSTOKEN: ${{ secrets.Q_PRODUCTION_ACCESSTOKEN }}
```

[to the top](#table-of-contents)

## Functionality

### Q dev server

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
    nzz_ch: {
      // target name
      additionalRenderingInfo: {
        // additionalRenderingInfo is tool based
        stylesheets: [
          {
            url: "https://service.sophie.nzz.ch/bundle/sophie-q@1,sophie-font@1,sophie-color@1,sophie-viz-color@1,sophie-input@1.css",
          },
        ],
      },
      context: {
        // context is target based
        stylesheets: [
          {
            url: "https://context-service.st.nzz.ch/stylesheet/all/nzz.ch.css",
          },
        ],
        background: {
          color: "#fff",
        },
      },
      toolRuntimeConfig: {
        displayOptions: {
          hideTitle: true,
        },
      },
    },
  };
}

module.exports = getConfig;
```

### Creating new Q server implementation

Once `Q` cli is installed one can create the skeleton of a Q server implementation by executing

```bash
Q new-server my-server-name
```

- The directory name where the server implementation is being created defaults to the server name and can be overwritten by using option `-d` or `--dir`

```bash
Q new-server my-server-name -d my-server-directory
```

### Creating new tool

Once `Q` cli is installed one can create the skeleton of a new tool by executing

```bash
Q new-tool my-tool-name
```

- The directory name where the new tool is being created defaults to the tool name and can be overwritten by using option `-d` or `--dir`

```bash
Q new-tool my-tool-name -d my-tool-directory
```

### Creating new custom code project

Once `Q` cli is installed one can create the skeleton of a new custom code project by executing

```bash
Q new-custom-code my-project-name
```

- The directory name where the new custom-code project is being created defaults to the project name and can be overwritten by using option `-d` or `--dir`

```bash
Q new-custom-code my-project-name -d my-project-directory
```

### Creating new ed-tech utility package project

Once `Q` cli is installed one can create the skeleton of a new ed-tech utility package project by executing

```bash
Q new-et-utils-package package-name package-author package-description
```

- The directory name where the new ed-tech utility package project is being created defaults to the project name and can be overwritten by using option `-d` or `--dir`

```bash
Q new-et-utils-package package-name -d my-project-directory
```

#### Notes

New utility package projects should only be created inside the [ed-tech-utilities](https://github.com/nzzdev/ed-tech-utilities) repository.

### Q item actions

The `Q` cli can copy and/or update existing Q items.

#### Updating existing Q items

Once `Q` cli installed one can update one or many Q items by executing:

```bash
Q update-item
```

- The path to the config file can be set by using option `-c` or `--config`. By default the `update-item` command will look for a config file called `q.config.json` in the current directory

```bash
Q update-item -c [path]
```

- Items of a specified environment can be updated by using the option `-e` or `--environment`. By default the `update-item` command updates all item specified in the config file

```bash
Q update-item -e [env]
```

- Stored configuration properties like Q-Server url or access tokens can be reset by using option `-r` or `--reset`

```bash
Q update-item -r
```

- Credentials can be provided as environment variables to avoid user prompts. The variable names are `Q_ENV_SERVER`, `Q_ENV_USERNAME`, `Q_ENV_PASSWORD`, `Q_ENV_ACCESSTOKEN`, where `ENV` is the uppercase version of the environment name.

```bash
Q_TEST_SERVER=[server_route] Q_TEST_USERNAME=[username] Q_TEST_PASSWORD=[password] Q update-item
```

or

```bash
Q_TEST_SERVER=[server_route] Q_TEST_ACCESSTOKEN=[accessToken] Q update-item
```

The config file has to follow [this json-schema](./bin/commands/qItem/updateItem/updateSchema.json). This schema will be extended by the respective tool schema of your Q item.
Here's an example:

```json
{
  "items": [
    {
      "environments": [
        // "environments" references the desired q items to be updated, at least 1 environment is required
        {
          "name": "production",
          "id": "6dcf203a5c5f74b61aeea0cb0eef7e0b" // Id of your q item in the production environment
        },
        {
          "name": "staging",
          "id": "6dcf203a5c5f74b61aeea0cb0ef2ca9f" // Id of your q item in the staging environment
        }
      ],
      "item": {
        // The actual content you want to update for your referenced q items listed in "environments"
        "title": "Der Konsum in der Schweiz springt wieder an",
        "subtitle": "Wöchentliche Ausgaben mittels Bankkarten in Mio. Fr. im Jahr 2020, zum Vergleich 2019",
        "data": [
          // "data" represents the data table of your q item inside the q-editor
          ["Datum", "2020", "2019"],
          ["2020-01-06", "690004302", "641528028"],
          ["2020-01-13", "662122373", "617653790"],
          ["2020-01-20", "688208667", "654303249"]
        ]
      }
    }
  ]
}
```

#### Copy existing Q items

Once `Q` cli installed one can copy one or many Q items by executing:

```bash
Q copy-item
```

- The path to the config file can be set by using option `-c` or `--config`. By default the `copy-item` command will look for a config file called `q.config.json` in the current directory

```bash
Q copy-item -c [path]
```

- Items of a specified environment can be updated by using the option `-e` or `--environment`. By default the `copy-item` command updates all item specified in the config file

```bash
Q copy-item -e [env]
```

- Stored configuration properties like Q-Server url or access tokens can be reset by using option `-r` or `--reset`

```bash
Q copy-item -r
```

- Credentials can be provided as environment variables to avoid user prompts. The variable names are `Q_ENV_SERVER`, `Q_ENV_USERNAME`, `Q_ENV_PASSWORD`, `Q_ENV_ACCESSTOKEN`, where `ENV` is the uppercase version of the environment name.

```bash
Q_TEST_SERVER=[server_route] Q_TEST_USERNAME=[username] Q_TEST_PASSWORD=[password] Q update-item
```

or

```bash
Q_TEST_SERVER=[server_route] Q_TEST_ACCESSTOKEN=[accessToken] Q update-item
```

The config file has to follow [this json-schema](./bin/commands/qItem/updateItem/updateSchema.json). This schema will be extended by the respective tool schema of your Q item.
Here's an example:

```json
{
  "items": [
    {
      "environments": [
        {
          "name": "production",
          "id": "6dcf203a5c5f74b61aeea0cb0eef7e0b" // Id of your q item in the production environment
        },
        {
          "name": "staging",
          "id": "6dcf203a5c5f74b61aeea0cb0ef2ca9f" // Id of your q item in the staging environment
        }
      ],
      "item": {
        "title": "Russische Angriffe auf die Ukraine",
        "subtitle": "Verzeichnete Angriffe in der ganzen Ukraine",
        "files": [
          // Adds or overwrites the listed files in your q item
          {
            "loadSyncBeforeInit": false, // Has to be set for the file upload to work
            "file": {
              "path": "./angriffsFlaechen.json" // Your local path to your file. The path is relative to where you execute the command.
            }
          }
        ]
      }
    }
  ]
}
```

[to the top](#table-of-contents)

## License

Copyright (c) Neue Zürcher Zeitung.

This software is licensed under the [MIT](LICENSE) License.
