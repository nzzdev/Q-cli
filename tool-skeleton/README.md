# Q-tool <travis-badge> <greenkeeper-badge>

**maintainer**: <maintainer>

Short description of tool and link to either [demo](https://editor.q.tools/) or [playground](https://q-playground.st.nzz.ch).

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Functionality](#functionality)
- [License](#license)

## Installation

```
git clone git@github.com:nzzdev/Q-tool.git
cd ./Q-xxxx
nvm use
npm install
npm run build
```

[to the top](#table-of-contents)

## Configuration

If env variables, explained here

## Development

Start the Q dev server:

```
npx @nzz/q-cli server
```

Run the Q tool:

```
node index.js
```

[to the top](#table-of-contents)

## Testing

The testing framework used in this repository is [Code](https://github.com/hapijs/code).

Run the tests:

```
npm run test
```

### Implementing a new test

When changing or implementing...

- A `route`, it needs to be tested in the `e2e-tests.js` file
- Something on the frontend, it needs to be tested in the `dom-tests.js` file

[to the top](#table-of-contents)

## Deployment

We provide automatically built docker images at https://hub.docker.com/r/nzzonline/q-xxx/.
There are three options for deployment:

- Use the provided images
- Build your own docker images
- Deploy the service using another technology

### Use the provided docker images

1. Deploy `nzzonline/q-xxx` to a docker environment
2. Set the ENV variables as described in the [configuration section](#configuration)

[to the top](#table-of-contents)

## Functionality

The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

Here are all features listed which will have an impact on the tool but are not options. For example spacing issues. If there's a visual aspect, a printscreen would be nice.
The printscreen can be implemented as following:
<img src="/doc/card-layout.png" align="right" width=300 height=355>

[to the top](#table-of-contents)

### Options

All options should be listed and explained. The varieties should be listed. If there's a visual aspect, a printscreen would be nice. The options should be listed as they are named in the `schema`
The printscreen can be implemented as following:
<img src="/doc/card-layout.png" align="right" width=300 height=355>

[to the top](#table-of-contents)

## License (if open source)

Adding the license + updating the year.
