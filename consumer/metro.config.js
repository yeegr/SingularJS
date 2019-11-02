module.exports = {
  projectRoot: path.resolve(__dirname),
  watchFolders: [
    path.resolve(__dirname, '../common')
  ],
  resolver: {
    sourceExts: ['ts', 'tsx', 'js', 'jsx']
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
}
