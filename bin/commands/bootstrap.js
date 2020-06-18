const fs = require("fs-extra");
const path = require("path");
const replaceInFile = require("replace-in-file");
const chalk = require("chalk");
const errorColor = chalk.red;
const successColor = chalk.green;

module.exports = async function (type, name, basedir) {
  if (fs.existsSync(basedir)) {
    console.error(
      errorColor(`directory ${basedir} already exists or is not writable`)
    );
    process.exit(1);
  } else {
    fs.mkdirSync(basedir);
  }

  const replaceOptions = {
    files: `${basedir}/**`,
    from: new RegExp(`${type}-skeleton`, "g"),
    to: name,
  };

  try {
    await fs.copySync(
      path.join(__dirname, `../../skeletons/${type}-skeleton`),
      basedir
    );
    await replaceInFile(replaceOptions);
    console.log(successColor(`Q ${type} is now bootstrapped in ${basedir}`));
  } catch (error) {
    console.error(
      errorColor(
        `An unexpected error occured. Please check the entered information and try again. ${JSON.stringify(
          error
        )}`
      )
    );
  }
};
