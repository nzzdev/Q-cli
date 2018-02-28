#!/usr/bin/env node

const program = require("commander");

program
  .version("1.0.0")
  .description("Q Toolbox cli")
  .command("new-tool", "bootstrap a new tool")
  .command("new-server", "bootstrap a new Q server implementation")
  .command("server", "start a simple server mocking a Q server for development")
  .parse(process.argv);
