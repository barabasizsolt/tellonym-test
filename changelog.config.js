const {
  types,
  typeChangelogMap,
  allScopesOptional,
} = require('./commitlint.shared')

module.exports = {
  list: types,
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'body'],
  scopes: allScopesOptional,
  types: typeChangelogMap,
}
