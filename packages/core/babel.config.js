const path = require('path')

module.exports = function (api) {
  api.cache(true)

  return {
    sourceMaps: true,
    presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      [
        'module-resolver',
        {
          root: path.resolve(__dirname, '../../'),
          alias: {
            '@tellonym/strings': path.resolve(__dirname, '../strings'),
          },
        },
      ],
    ].filter(Boolean),
  }
}
