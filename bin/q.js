#!/usr/bin/env node

const program = require("commander");
const version = require("../package.json").version;

program
  .version(version)
  .description("Q Toolbox cli")
  .command("new-tool", "bootstrap a new tool")
  .command("new-server", "bootstrap a new Q server implementation")
  .command("server", "start a simple server mocking a Q server for development")
  .parse(process.argv);
