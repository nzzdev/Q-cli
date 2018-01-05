async function getConfig() {
  return {
    nzz_ch: {
      additionalRenderingInfo: { // additionalRenderingInfo is tool based
        stylesheets: [
          {
            url: 'https://service.sophie.nzz.ch/bundle/sophie-q@1,sophie-font@1,sophie-color@1,sophie-viz-color@1,sophie-input@1.css'
          }
        ]
      },
      context: { // context is target based
        stylesheets: [
          {
            url: 'https://context-service.st.nzz.ch/stylesheet/all/nzz.ch.css'
          }
        ],
        background: {
          color: '#fff'
        }
      },
      toolRuntimeConfig: {
  
      }
    },
    nzzas: {
      additionalRenderingInfo: {
        stylesheets: [
          {
            url: 'https://service.sophie.nzz.ch/bundle/sophie-nzzas-q@1,sophie-nzzas-font@1,sophie-nzzas-color@1,sophie-nzzas-viz-color@1,sophie-nzzas-input@1.css'
          }
        ]
      },
      context: {
        stylesheets: [
          {
            url: 'https://context-service.st.nzz.ch/stylesheet/all/nzzas.nzz.ch.css'
          }
        ],
        background: {
          color: '#fff'
        }
      },
      toolRuntimeConfig: {
  
      }
    }
  }
}

module.exports = getConfig;
