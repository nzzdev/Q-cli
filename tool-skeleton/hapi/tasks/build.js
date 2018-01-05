const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const sass = require('node-sass')
const postcss = require('postcss')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const stylesDir = path.join(__dirname, '/../styles_src/')

function writeHashmap (hashmapPath, files, fileext) {
  const hashMap = {}
  files
    .map(file => {
      const hash = crypto.createHash('md5')
      hash.update(file.content, { encoding: 'utf8' })
      file.hash = hash.digest('hex')
      return file
    })
    .map(file => {
      hashMap[file.name] = `${file.name}.${file.hash.substring(0, 8)}.${fileext}`
    })

  fs.writeFileSync(hashmapPath, JSON.stringify(hashMap))
}

async function compileStylesheet (name) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(stylesDir, `${name}.scss`)
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        reject(new Error(`stylesheet ${filePath} cannot be read`))
        process.exit(1)
      }
      sass.render(
        {
          file: filePath,
          outputStyle: 'compressed'
        },
        (err, sassResult) => {
          if (err) {
            reject(err)
          } else {
            postcss()
              .use(postcssImport)
              .use(autoprefixer)
              .use(cssnano)
              .process(sassResult.css, {
                from: path.join(stylesDir, `${name}.css`)
              })
              .then(prefixedResult => {
                if (prefixedResult.warnings().length > 0) {
                  console.log(`failed to compile stylesheet ${name}`)
                  process.exit(1)
                }
                resolve(prefixedResult.css)
              })
          }
        }
      )
    })
  })
}

async function buildStyles () {
  try {
    // compile styles
    const styleFiles = [
      {
        name: 'default',
        content: await compileStylesheet('default')
      }
    ]

    styleFiles.map(file => {
      fs.writeFileSync(`styles/${file.name}.css`, file.content)
    })

    writeHashmap('styles/hashMap.json', styleFiles, 'css')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

Promise.all(
  [
    buildStyles()
  ])
  .then(res => {
    console.log('build complete')
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })
