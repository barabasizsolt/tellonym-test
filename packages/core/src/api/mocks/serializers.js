/* eslint prefer-rest-params: 0 */
import { Serializer } from 'miragejs' // eslint-disable-line import/no-extraneous-dependencies
import { normalize } from '../../helpers'

/**
 * Transforms response into data meta format
 */
export const ApplicationSerializer = Serializer.extend({
  serialize: function serialize() {
    const json = Serializer.prototype.serialize.apply(this, arguments)

    if (typeof json.data !== 'undefined' && typeof json.meta !== 'undefined') {
      return json
    }

    return {
      data: json,
      meta: {},
    }
  },
})

/**
 * Replaces the first array in 'data' with normalised ids data structure
 */
export const NormaliseSerializer = ApplicationSerializer.extend({
  serialize: function serialize() {
    const json = ApplicationSerializer.prototype.serialize.apply(
      this,
      arguments
    )

    const data = Object.keys(json.data).reduce((acc, key) => {
      if (Array.isArray(json.data[key])) {
        return { ...acc, ...normalize(json.data[key]) }
      }

      acc[key] = json.data[key]

      return acc
    }, {})

    return { ...json, data }
  },
})
