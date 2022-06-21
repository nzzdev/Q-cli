# @nzz/et-utils-<package-name>

<package-description>

## Content

TODO: Package documentation

## Modules & Node support

The package follows a hybrid module structure, supporting ES6 & CommonJS Module imports.
Node support can be implemented by changing the internal, relative import statements to include the file type suffix `.js` (not `.ts`!). This however breaks the CommonJS Module imports (`require()`), which should not be an issue if Node 12+ is used in the project.
