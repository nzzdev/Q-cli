#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const errorColor = chalk.red;
const version = require("../package.json").version;
const runServer = require("./commands/server.js");
const newToolOrServer = require("./commands/newToolOrServer.js");
const updateItem = require("./commands/updateItem/updateItem.js");

async function main() {
  program.version(version).description("Q Toolbox cli");

  program
    .command("server")
    .option("-p, --port [port]", "the port to start the server on")
    .option(
      "-t, --target [target]",
      "the target being used for rendering info route"
    )
    .option(
      "-b, --tool-base-url [url]",
      "the tool base url being set in rendering info route"
    )
    .option(
      "-c, --config [config]",
      "the config file name in which additional rendering info and tool runtime config is specified"
    )
    .description("start a simple server mocking a Q server for development")
    .action(async () => {
      await runServer(program);
    });

  program
    .command("new-server")
    .option(
      "-d, --dir [path]",
      "the base directory to bootstrap the new Q server implementation in, defaults to the name of Q server implementation"
    )
    .description("bootstrap a new Q server implementation")
    .action(async () => {
      const name = program.args[1];
      if (!name) {
        console.error(errorColor("no servername given"));
        process.exit(1);
      }
      const baseDir = program.dir || name;
      await newToolOrServer("server", name, baseDir);
    });

  program
    .command("new-tool")
    .option(
      "-d, --dir <path>",
      "the base directory to bootstrap the new tool in, defaults to the tools name"
    )
    .description("bootstrap a new tool")
    .action(async () => {
      const name = program.args[1];
      if (!name) {
        console.error(errorColor("no toolname given"));
        process.exit(1);
      }
      const baseDir = program.dir || name;
      await newToolOrServer("tool", name, baseDir);
    });

  program
    .command("update-item")
    .description("update q item")
    .option(
      "-c, --config <path>",
      "set config path which defines the q items to be updated. defaults to ./q.config.json",
      `${process.cwd()}/q.config.json`
    )
    .option("-r, --reset", "reset stored configuration properties")
    .action(async (command) => {
      await updateItem(command);
    });

  await program.parseAsync(process.argv);
}

main();
