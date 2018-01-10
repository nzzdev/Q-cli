const fs = require('fs-extra')
const path = require('path')

const replaceInFile = require('replace-in-file')

const program = require('commander')
  .option('-d, --dir [path]', 'the base directory to bootstrap the new Q server implementation in, defaults to the name of Q server implementation')
  .parse(process.argv)

const serverName = program.args[0];
if (!serverName) {
  console.error('no name for Q server implementation given')
  process.exit(1)
}

const baseDir = program.dir || serverName;

bootstrap(serverName, baseDir, 'hapi');

async function bootstrap(serverName, basedir, variant) {
  try {
    fs.mkdirSync(basedir)
  } catch (err) {
    console.error(`directory ${basedir} already exists or is not writable`)
    process.exit(1)
  }

  const replaceOptions = {
    files: `${basedir}/**`,
    from: /server-skeleton/g,
    to: serverName
  }

  try {
    await fs.copySync(path.join(__dirname, '../server-skeleton', variant), basedir)
    await replaceInFile(replaceOptions)
    console.log(`Q server implementation is now bootstraped in ${basedir}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
