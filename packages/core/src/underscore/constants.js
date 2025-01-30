import { logger } from './logger'

export const sec = 1000
export const min = 60 * sec
export const h = 60 * min
export const d = 24 * h
export const w = 7 * d

const createDevMutationWarningProxy = (obj) => {
  if (!__DEV__) {
    return obj
  }

  return new Proxy(obj, {
    set(obj, prop, value) {
      logger.error(
        new Error(
          `DO_NOT_MUTATE objects are not meant to be mutated, but ${prop} was set to ${value}.`
        )
      )

      return Reflect.set(obj, prop, value)
    },
  })
}

export const DO_NOT_MUTATE = {
  EMPTY: {
    ARRAY: createDevMutationWarningProxy([]),
    OBJECT: createDevMutationWarningProxy({}),
    ITEMS: createDevMutationWarningProxy({
      ids: createDevMutationWarningProxy([]),
      data: createDevMutationWarningProxy({}),
    }),
  },
}
