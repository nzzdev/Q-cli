const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

function createOutputCssFunction(writeHashmapFunction) {
  const outputCssFunction = (styles, styleNodes) => {
    const stylesDir = "styles";

    if (!fs.existsSync(stylesDir)) {
      fs.mkdirSync(stylesDir);
    }

    fs.writeFileSync(`styles/default.css`, styles);
    writeHashmapFunction(
      "styles/hashMap.json",
      {
        name: "default",
        content: styles,
      },
      "css"
    );
  };

  return outputCssFunction;
}

function getPostcssPlugins(isProduction) {
  const postcssPlugins = [autoprefixer];

  if (isProduction) {
    postcssPlugins.push(cssnano);
  }

  return postcssPlugins;
}

function get(isProduction, writeHashmapFunction) {
  const config = {
    outputStyle: isProduction ? "compressed" : "expanded",
    // Sourcemap generation (specifically writing the file to system) is currently not supported by rollup-plugin-sass (but soon!)
    // See: https://github.com/thgh/rollup-plugin-scss/issues/7
    // outFile: path.join(__dirname, "/styles/default.css"), // <- Uncomment after: https://github.com/thgh/rollup-plugin-scss/issues/7
    sourceMap: !isProduction,
    sourceMapEmbed: !isProduction, // Remove after: https://github.com/thgh/rollup-plugin-scss/issues/7
    failOnError: !isProduction,
    watch: [
      path.join(__dirname, "/styles_src"),
      path.join(__dirname, "/views"),
    ],
    processor: (css) =>
      postcss(getPostcssPlugins(isProduction))
        .process(css, {
          from: path.join(__dirname, "/styles/default.css"),
          to: path.join(__dirname, "/styles/default.css"),
          map: isProduction ? false : { inline: true }, // Set to false after: https://github.com/thgh/rollup-plugin-scss/issues/7
        })
        .then((result) => result.css),
    output: createOutputCssFunction(writeHashmapFunction),
  };

  return config;
}

module.exports = { get };
