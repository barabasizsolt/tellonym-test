module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs,ts,tsx}', '!src/**/*.d.ts'],
  setupFiles: ['<rootDir>/__mocks__/setupTests.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,mjs,ts,tsx}',
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(ramda)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
    'mjs',
  ],
  resetMocks: true,
  globals: {
    __DEV__: true,
    __RCTProfileIsProfiling: false,
  },
}
