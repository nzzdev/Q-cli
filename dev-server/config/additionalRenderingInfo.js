const targetConfig = require('./targetConfig.js')

function getSophieUrl (target) {
  let sophieUrl = 'https://service.sophie.nzz.ch/bundle/'
  targetConfig[target].sophie.forEach((moduleName, index) => {
    sophieUrl += moduleName
    if (index < targetConfig[target].sophie.length - 1) {
      sophieUrl += ','
    }
  })
  return `${sophieUrl}.css`
}

function getContextUrl (target) {
  return targetConfig[target].context
}

function getAdditionRenderingInfo (target, sophieUrl) {
  if (!sophieUrl) {
    sophieUrl = getSophieUrl(target)
  }
  return {
    stylesheets: [
      {
        url: sophieUrl
      },
      {
        url: getContextUrl(target)
      }
    ],
    background: {
      color: '#fff'
    }
  }
}

module.exports = getAdditionRenderingInfo
