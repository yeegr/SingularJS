module.exports = {
  preset: 'react-native',
  roots: [
    '<rootDir>/__tests__'
  ],
  transform: {
    "^.+\\.tsx?$": 'ts-jest'
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  },
  cacheDirectory: '.jest/cache'
}