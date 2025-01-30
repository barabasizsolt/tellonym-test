type Timing = {
  id: string
  description?: string | undefined
  get: () => string | number
  name: string
  overwriteValue?: number | undefined
  initialValue: number
  value: number
}

const timings: { [uuid: string]: Timing } = {}

type Storage = {
  getAllKeys: () => string[]
  getString: (key: string) => string
  getNumber: (key: string) => number
  getBoolean: (key: string) => boolean
  getObject: (key: string) => unknown
  setObject: (key: string) => unknown
  set: (key: string, value: boolean | string | number | Uint8Array) => void
  delete: (key: string) => void
}

let storage: Storage

const setStorage = (_storage: Storage) => {
  storage = _storage
}

const getStorageKey = (id: string) => `debug.timing.${id}`

const getCreator = (id: string) => (): number =>
  timings[id].overwriteValue ?? timings[id].value

const add = (
  name: string,
  initialValue: number,
  description?: string
): Timing => {
  const id = name

  if (typeof timings[id] !== 'undefined') {
    return timings[id]
  }

  const value = storage.getNumber(getStorageKey(id)) ?? initialValue

  timings[id] = {
    id,
    description,
    name,
    initialValue,
    value,
    get: getCreator(id),
  }

  return timings[id]
}

const getEntries = (): { [uuid: string]: Timing } => {
  return timings
}

const overwrite = (id: string, overwriteValue: number | undefined): Timing => {
  timings[id].overwriteValue = overwriteValue

  return timings[id]
}

const update = (id: string, value: number): Timing => {
  timings[id].value = value

  storage.set(getStorageKey(id), value)

  return timings[id]
}

const reset = (id: string): Timing => {
  timings[id].overwriteValue = undefined
  timings[id].value = timings[id].initialValue

  storage.delete(getStorageKey(id))

  return timings[id]
}

export const timing = {
  add,
  getEntries,
  overwrite,
  reset,
  setStorage,
  update,
}
