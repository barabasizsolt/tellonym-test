const { types, typeScopeMap } = require('./commitlint.shared')

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', types],
    // 'scope-enum': [2, 'always', projectScopes],
    'scope-enums': [2, 'always', typeScopeMap],
  },
  plugins: [
    {
      rules: {
        /**
         * https://github.com/conventional-changelog/commitlint/issues/395#issuecomment-885968687
         *
         * - If a type does not appear in the rule, do not enforce scope
         * - If a type appears in the rule with an empty array,
         *   do not allow scope
         * - If a type appears in the rule with an non-empty array,
         *   only allow the values in the array for scope.
         * - If the array includes null, the scope is optional.
         *
         * E.g., {
         *   'scope-enums': [2, "always", {
         *     feat: [/^frontend\/[^\/]+$/, 'backend'],
         *     perf: [],
         *     ci: [null, 'codebuild', 'jenkins']
         *   }]
         * }
         *
         * In the above rules configuration,
         *  - if the type is 'feat', the scope must be either
         *    match the regex /frontend\/[^\/]+/ or be 'backend'
         *  - if the type if 'chore', the scope is optional and can
         *    be anything
         *  - if the type is 'perf', a scope is not allowed
         *  - if the type is 'ci', the scope must be 'codebuild' or
         *    'jenkins' if present, but is not required
         */
        'scope-enums': (ctx, applicable, rule) => {
          if (applicable === 'never') {
            return [false, 'the "allowed-scopes" rule does not support "never"']
          }

          const allowedScopes = rule[ctx.type]

          // If the type does not appear in the rule config, allow any scope or no scope
          if (allowedScopes === undefined) {
            return [true]
          }

          if (Array.isArray(allowedScopes)) {
            // If the type maps to an empty array in the rule config, scope it not allowed
            if (allowedScopes.length === 0) {
              if (ctx.scope != null) {
                return [
                  false,
                  `commit messages with type "${ctx.type}" must not specify a scope`,
                ]
              }

              return [true]
            }

            // Otherwise attempt to match against either null, a string literal, or a RegExp
            if (
              allowedScopes.findIndex((s) => {
                if (
                  typeof ctx.scope === 'string' &&
                  Object.prototype.toString.call() === '[object RegExp]'
                ) {
                  return ctx.scope.match(s)
                }

                // Equality comparison works for both strings and null
                return s === ctx.scope
              }) !== -1
            ) {
              return [true]
            } else if (allowedScopes.includes(null)) {
              return [
                false,
                `commit message with type "${
                  ctx.type
                }" may specify a scope, but if specified, it must be one of the following: ${allowedScopes
                  .filter((s) => s !== null)
                  .map((s) => `"${s}"`)
                  .join(', ')}`,
              ]
            } else {
              return [
                false,
                `commit message with type "${
                  ctx.type
                }" must specify one of the following scopes: ${allowedScopes
                  .map((s) => `"${s}"`)
                  .join(', ')}`,
              ]
            }
          }

          return [
            false,
            `invalid rule entry: { ${ctx.type}: ${JSON.stringify(
              allowedScopes
            )} }`,
          ]
        },
      },
    },
  ],
}
