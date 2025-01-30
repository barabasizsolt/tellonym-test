import { EventEmitter } from './EventEmitter'

const emitter = new EventEmitter()

export const addListener = (...params) => {
  return emitter.addListener(...params)
}

export const emit = (...params) => {
  return emitter.emit(...params)
}
