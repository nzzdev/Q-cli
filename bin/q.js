#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const errorColor = chalk.red;
const version = require("../package.json").version;
const runServer = require("./commands/server.js");
const bootstrap = require("./commands/bootstrap.js");
const updateItem = require("./commands/qItem/updateItem/updateItem.js");
const copyItem = require("./commands/qItem/copyItem/copyItem.js");
const createCustomCodeItem = require("./commands/qItem/createCustomCodeItem/createCustomCodeItem.js");

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
    .action(async (command) => {
      await runServer(command);
    });

  program
    .command("new-server")
    .option(
      "-d, --dir [path]",
      "the base directory to bootstrap the new Q server implementation in, defaults to the name of Q server implementation"
    )
    .description("bootstrap a new Q server implementation")
    .action(async (command) => {
      const name = command.args[0];
      if (!name) {
        console.error(errorColor("no servername given"));
        process.exit(1);
      }
      const baseDir = program.dir || name;
      const textReplacements = [
        { regex: new RegExp(`server-skeleton`, "g"), replaceWith: name },
      ];

      await bootstrap("server", baseDir, textReplacements);
    });

  program
    .command("new-tool")
    .option(
      "-d, --dir <path>",
      "the base directory to bootstrap the new tool in, defaults to the tools name"
    )
    .description("bootstrap a new tool")
    .action(async (command) => {
      let name = command.args[0];

      if (!name) {
        console.error(errorColor("no toolname given"));
        process.exit(1);
      }

      // Make sure the name matches the spec.
      if (!name.match(/^(Q-|q-)\w+/g)) {
        console.error(errorColor("Tool must be named according to this format: Q-[a-z+]"));
        process.exit(1);
      }

      // Capitalize first letter.
      name = name[0].toUpperCase() + name.substring(1).toLowerCase();

      let nameNodashes = name.replace(/\-/g, '');
      toolnameCamelCase = nameNodashes[0].toUpperCase() + nameNodashes[1].toUpperCase() + nameNodashes.substring(2);

      const baseDir = program.dir || name;
      const textReplacements = [
        // deprecated.
        { regex: /tool-skeleton/g, replaceWith: name },

        // Replace all instance of tool name with underscore.
        { regex: /\[tool_name\]/g, replaceWith: name.toLowerCase().replace(/\-/g, '_') },

        // Replace all instances with minuses.
        { regex: /\[Tool-name\]/g, replaceWith: name },
        { regex: /\[tool-name\]/g, replaceWith: name.toLowerCase() },

        // Replace all CamelCase instances.
        { regex: /\[ToolName\]/g, replaceWith: toolnameCamelCase},
      ];

      await bootstrap("toolv2", baseDir, textReplacements);
    });

  program
    .command("new-custom-code")
    .option(
      "-d, --dir <path>",
      "the base directory to bootstrap the new tool in, defaults to the tools name"
    )
    .description("bootstrap a new custom code project")
    .action(async () => {
      const name = program.args[1];
      if (!name) {
        console.error(errorColor("no custom-code projectname given"));
        process.exit(1);
      }
      const baseDir = program.dir || name;
      const textReplacements = [
        { regex: new RegExp(`custom-code-skeleton`, "g"), replaceWith: name },
      ];

      await bootstrap("custom-code", baseDir, textReplacements);
    });

  program
    .command("new-et-utils-package")
    .option(
      "-d, --dir <path>",
      "the base directory to bootstrap the new tool in, defaults to the tools name"
    )
    .description("bootstrap a new ed-tech utility package")
    .action(async () => {
      const name = program.args[1];
      const author = program.args[2] || "TODO: Set package author name";
      const description =
        program.args[3] || "TODO: Write a package description";

      if (!name) {
        console.error(errorColor("no package name given"));
        process.exit(1);
      }

      const baseDir = program.dir || name;
      const textReplacements = [
        { regex: new RegExp("<package-name>", "g"), replaceWith: name },
        { regex: new RegExp("<author-name>", "g"), replaceWith: author },
        {
          regex: new RegExp("<package-description>", "g"),
          replaceWith: description,
        },
      ];

      await bootstrap("et-utils-package", baseDir, textReplacements);
    });

  program
    .command("update-item")
    .description("update q item")
    .option(
      "-c, --config [path]",
      "set config path which defines the q items to be updated. defaults to ./q.config.json",
      `${process.cwd()}/q.config.json`
    )
    .option(
      "-e, --environment [env]",
      "set environment which should be updated, defaults to update all items of all environments defined in config"
    )
    .option("-r, --reset", "reset stored configuration properties")
    .action(async (command) => {
      await updateItem(command);
    });

  program
    .command("copy-item")
    .description("copies an existing q item")
    .option(
      "-c, --config [path]",
      "set config path which defines the q items to be copied. defaults to ./q.config.json",
      `${process.cwd()}/q.config.json`
    )
    .option(
      "-e, --environment [env]",
      "set environment where the existing q item is found, defaults to copy all items of all environments defined in config"
    )
    .option("-r, --reset", "reset stored configuration properties")
    .action(async (command) => {
      await copyItem(command);
    });

  program
    .command("create-custom-code-item")
    .description("creates a new q custom code item in the db and adds it to the q config file")
    .option(
      "-c, --config [path]",
      "set config path to q.config.json. defaults to ./q.config.json",
      `${process.cwd()}/q.config.json`
    )
    .option(
      "-e, --environment [env]",
      "set environment where the new q custom code item should be created in"
    )
    .option(
      "-t, --title [title]",
      "set title of the new q custom code item"
    )
    .option("-r, --reset", "reset stored configuration properties")
    .action(async (command) => {
      await createCustomCodeItem(command);
    });

  await program.parseAsync(process.argv);
}

main();
