export default {
  transform: {
    '^.+\\.m?[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
  testMatch: [
    '**/tests/**/*.test.mjs',
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.mjs',
    '**/__tests__/**/*.js',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};
