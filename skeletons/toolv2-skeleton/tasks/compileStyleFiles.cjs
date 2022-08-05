const fs = require('fs');
const crypto = require('crypto');

const sass = require('sass');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const stylesDir = __dirname + '/../src/styles/';

function writeHashmap(hashmapPath, files, fileext) {
  const hashMap = {};

  files
    .map((file) => {
      const hash = crypto.createHash('md5');
      hash.update(file.content, { encoding: 'utf8' });
      file.hash = hash.digest('hex');
      return file;
    })
    .map((file) => {
      hashMap[file.name] = `${file.name}.${file.hash.substring(0, 8)}.${fileext}`;
    });

  fs.writeFileSync(hashmapPath, JSON.stringify(hashMap));
}

async function compileStylesheet(name) {
  return new Promise((resolve, reject) => {
    const filePath = stylesDir + `${name}.scss`;

    const exists = fs.existsSync(filePath);
    if (!exists) {
      reject(`stylesheet not found ${filePath}`);
      process.exit(1);
    }

    sass.render(
      {
        file: filePath,
        includePaths: ['jspm_packages/github/', 'jspm_packages/npm/'],
        outputStyle: 'compressed',
      },
      (err, sassResult) => {
        if (err) {
          reject(err);
        } else {
          postcss()
            .use(postcssImport)
            .use(autoprefixer)
            .use(cssnano)
            .process(sassResult.css, {
              from: `${stylesDir}${name}.css`,
            })
            .then((prefixedResult) => {
              if (prefixedResult.warnings().length > 0) {
                console.log(`failed to compile stylesheet ${name}`);
                process.exit(1);
              }
              resolve(prefixedResult.css);
            });
        }
      }
    );
  });
}

async function buildStyles() {
  const basePath = 'dist/styles';
  const fullPathHashmap = `${basePath}/hashMap.json`;

  // Check if directory exists.
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  const styleFiles = [
    {
      name: 'main',
      content: await compileStylesheet('main'),
    },
  ];

  styleFiles.map(file => {
    const fullPathCss = `${basePath}/${file.name}.css`;
    fs.writeFileSync(fullPathCss, file.content, { flag: 'w' });
  });

  writeHashmap(fullPathHashmap, styleFiles, 'css');
}

Promise.all([
  buildStyles(),
]).then(() => {
    console.log('build complete');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
