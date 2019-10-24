module.exports = {
  roots: [
    '<rootDir>/__tests__'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  testEnvironment: 'node'
}