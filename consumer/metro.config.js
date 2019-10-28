import path from 'path'

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: ['ts', 'tsx', 'js']
  },
  projectRoot: path.resolve(__dirname),
  watchFolders: [
    path.resolve(__dirname, '../common')
  ]
}

// module.exports = {
//   projectRoot: './',
//   watchFolders: [
//     '../common'
//   ]
// }
