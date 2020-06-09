const fs = require("fs-extra");
const path = require("path");
const replaceInFile = require("replace-in-file");

module.exports = async function (type, name, basedir) {
  if (fs.existsSync(basedir)) {
    console.error(`directory ${basedir} already exists or is not writable`);
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
      path.join(__dirname, `../../${type}-skeleton`, "hapi"),
      basedir
    );
    await replaceInFile(replaceOptions);
    console.log(`Q ${type} is now bootstraped in ${basedir}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
