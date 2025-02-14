// eslint-disable-next-line import/no-extraneous-dependencies
import { Response as MResponse } from 'miragejs'

export const serializers = {}
export const models = {}

export const factories = {}

export const seeds = function seeds() {}

export const routes = function routes() {
  this.post('/userinterview', (schema, request) => {
    const { field1, field2 } = JSON.parse(request.requestBody)

    if (typeof field1 !== 'string' || typeof field2 !== 'string') {
      const s = new MResponse(
        400,
        {},
        {
          errors: ['field1 and field2 need to be strings'],
        }
      )
      return s
    }

    return new Response(200, {}, { payload: 'ok' })
  })
}
