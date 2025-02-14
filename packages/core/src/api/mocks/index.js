/**
 * This tool enables you to mock the API responses. For this we use miragejs.
 * Docs: https://miragejs.com/tutorial/intro/
 *
 * To add a module you create a new file that exports objects and functions for miragejs,,
 * import it here and add it to the modules array below.
 *
 * A module can export the following structure:
 * serializers: {Object}
 * models: {Object}
 * factories: {Object}
 * seeds: {Function}
 * routes: {Function}
 *
 * It is important that the seeds and routes function are normal functions and not arrow functions
 * because they need access to the overlaying this context.
 *
 * Example module: https://github.com/tellonym/frontend/blob/4c67fd7dc8e312e98224d6877f5edf236c356599/packages/core/src/api/mocks/statistics.js
 *
 * To create proper mock data you can also use fakerjs which already is added
 * to the project.
 * Docs: https://fakerjs.dev/api/
 */

import * as common from './common'
import * as modcp from './modcp'
import * as userinterview from './userinterview'

export const modules = [common, modcp, userinterview]
