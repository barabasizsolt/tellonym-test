module.exports = {
  extends: '../../.eslintrc.js',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
    },
  },
  env: {
    browser: true,
  },
  rules: {
    'no-unused-vars': 'warn',
  },
}
