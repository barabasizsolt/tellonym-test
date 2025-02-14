module.exports = {
  verbose: true,
  resetMocks: true,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/packages/app/node_modules',
    '<rootDir>/packages/core/src',
    '<rootDir>/packages/modcp/node_modules',
    '<rootDir>/packages/web/node_modules',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@tellonym/core/(.*)': '<rootDir>/packages/core/src/$1',
  },
}
