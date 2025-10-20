export default {
  transform: {
    '^.+\\.m?[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
};
