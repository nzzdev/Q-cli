const Confidence = require('confidence');

const editorConfig = {
  auth: {
    type: 'token' 
  },
  languages: [
    {
      key: 'en',
      label: 'en'
    },
    {
      key: 'de',
      label: 'de'
    }
  ],
  departments: [
    "Economics",
    "Politics"
  ],
  publications: [
    {
      key: 'pub1',
      label: 'Publication 1',
      previewTarget: 'target1'
    }
  ],
  lowNewItems: {
    threshold: 1,
    days: 365
  },
  itemList: {
    itemsPerLoad: 18
  },
  help: {
    intro: 'This is the Q editor. Just click around to learn how it works.',
    faq: [
      {
        question: 'What is Q?',
        answer: 'Q is a browser-based toolbox that allows reporters and editors to create simple graphics and interactive elements for their stories.'
      }
    ]
  },
  stylesheets: [
    {
      // Roboto is used in Q editor
      url: 'https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin'
    },
    // if needed add some stylesheets here for preview, e.g. font-faces which do not work in ShadowRoot
  ],
  uiBehavior: {
    useItemDialogToActivate: false
  },
  eastereggs: {
    sounds: {
      m: '',
      q: '',
      bondTheme: ''
    }
  }
}

const env = process.env.APP_ENV || 'local';
const store = new Confidence.Store(editorConfig);

module.exports.get = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria)
  return store.get(key, criteria)
}

module.exports.meta = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria)
  return store.meta(key, criteria)
}