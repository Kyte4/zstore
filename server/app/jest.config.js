export default {
  transform: {
    '^.+\\.m?[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
};
