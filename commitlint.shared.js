const projectScopes = ['app', 'core', 'modcp', 'strings', 'web']
const typeScopes = ['android', 'ios', 'ci', 'deps']
const allScopes = projectScopes.concat(typeScopes)
const allScopesOptional = [null].concat(allScopes)
const projectScopesOptional = [null].concat(projectScopes)

const config = {
  build: {
    scopes: allScopesOptional,
    description:
      'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    emoji: '',
    value: 'build',
  },
  ci: {
    scopes: allScopesOptional,
    description:
      'Changes to our CI configuration files and scripts (example scopes: Gitlab)',
    emoji: '',
    value: 'ci',
  },
  cli: {
    scopes: allScopesOptional,
    description: 'Changes to our command line interface',
    emoji: '',
    value: 'cli',
  },
  docs: {
    scopes: allScopesOptional,
    description: 'Documentation only changes',
    emoji: '',
    value: 'docs',
  },
  feat: {
    scopes: projectScopesOptional,
    description: 'A new feature',
    emoji: '',
    value: 'feat',
  },
  fix: {
    scopes: projectScopesOptional,
    description: 'A bug fix',
    emoji: '',
    value: 'fix',
  },
  impr: {
    scopes: projectScopesOptional,
    description: 'An improvement that neither is a fix or a feature',
    emoji: '',
    value: 'impr',
  },
  refactor: {
    scopes: allScopesOptional,
    description:
      'A code (style) change that leaves the functionality unchanged',
    emoji: '',
    value: 'refactor',
  },
  test: {
    scopes: allScopesOptional,
    description:
      'Add missing tests, correct existing tests or remove obsolete tests',
    emoji: '',
    value: 'test',
  },
  skip: {
    scopes: allScopesOptional,
    description: 'This commit will not be shown in changelog',
    emoji: '',
    value: 'skip',
  },
  wip: {
    scopes: allScopesOptional,
    description:
      'A work in progress commit not intended to be merged into develop or master',
  },
}

const types = Object.keys(config)

const typeChangelogMap = types.reduce(
  (acc, key) =>
    config[key].description
      ? {
          ...acc,
          [key]: {
            description: config[key].description,
            emoji: config[key].emoji,
            value: config[key].value,
          },
        }
      : acc,
  {}
)

const typeScopeMap = types.reduce(
  (acc, key) => ({
    ...acc,
    [key]: config[key].scopes,
  }),
  {}
)

module.exports = {
  types,
  typeChangelogMap,
  typeScopeMap,
}
