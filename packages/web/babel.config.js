const path = require('path')

module.exports = function (api) {
  api.cache(true)

  return {
    sourceMaps: true,
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      [
        'module-resolver',
        {
          root: path.resolve(__dirname, '../../'),
          alias: {
            '@tellonym/core': path.resolve(__dirname, '../core/src'),
            '@tellonym/strings': path.resolve(__dirname, '../strings'),
          },
        },
      ],
    ].filter(Boolean),
  }
}
