const fs = require("fs-extra");
const path = require("path");
const replaceInFile = require("replace-in-file");
const chalk = require("chalk");
const { replace } = require("nunjucks/src/filters");
const errorColor = chalk.red;
const successColor = chalk.green;
const warningColor = chalk.yellow;

/**
 *
 * @param {string} type - Skeleton type
 * @param {string} name - Name of the project
 * @param {string} basedir - Base directory name to be created
 * @param {Array.<{regex: RegExp, replaceWith: string}>} textReplacements
 */
module.exports = async function (type, basedir, textReplacements) {
  if (fs.existsSync(basedir)) {
    console.error(
      errorColor(`directory ${basedir} already exists or is not writable`)
    );
    process.exit(1);
  } else {
    fs.mkdirSync(basedir);
  }

  try {
    await fs.copySync(
      path.join(__dirname, `../../skeletons/${type}-skeleton`),
      basedir
    );

    if (textReplacements) {
      for (const txtRe of textReplacements) {
        await replaceText(txtRe.regex, txtRe.replaceWith, basedir);
      }
    }

    console.log(successColor(`Q ${type} is now bootstrapped in ${basedir}`));

    if (type === "tool" || type === "et-utils-package")
      console.log(
        warningColor(
          "Search for 'TODO' inside the new tool/package to get started!"
        )
      );
  } catch (error) {
    console.error(
      errorColor(
        `An unexpected error occurred. Please check the entered information and try again. ${JSON.stringify(
          error
        )}`
      )
    );
  }
};

async function replaceText(regex, replaceWith, basedir) {
  const replaceOptions = {
    files: `${basedir}/**`, // Replace in all files
    from: regex,
    to: replaceWith,
    glob: {
      dot: true, // Include file names starting with a dot
    },
  };

  return await replaceInFile(replaceOptions);
}
