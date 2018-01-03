const fs = require('fs-extra')
const path = require('path')

const replaceInFile = require('replace-in-file')

const program = require('commander')
  .option('-d, --dir [path]', 'the base directory to bootstrap the new tool in, defaults to the tools name')
  .parse(process.argv)

const toolname = program.args[0];
if (!toolname) {
  console.error('no toolname given')
  process.exit(1)
}

const baseDir = program.dir || toolname;

bootstrap(toolname, baseDir, 'hapi');

async function bootstrap(toolname, basedir, variant) {
  try {
    fs.mkdirSync(basedir)
  } catch (err) {
    console.error(`directory ${basedir} already exists or is not writable`)
    process.exit(1)
  }

  const replaceOptions = {
    files: `${basedir}/**`,
    from: /tool-skeleton/g,
    to: toolname
  }

  try {
    await fs.copySync(path.join(__dirname, '../tool-skeleton', variant), basedir)
    await replaceInFile(replaceOptions)
    console.log(`Q tool is now bootstraped in ${basedir}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
