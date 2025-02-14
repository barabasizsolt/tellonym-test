import fetchMock from 'jest-fetch-mock'
import { configureCore } from '../src/config'

fetchMock.enableMocks()

global.cancelAnimationFrame = jest.fn()
global.requestAnimationFrame = jest.fn()

configureCore({
  api: { limit: 15 },
  helpers: { maxTellAmountForActivationalTells: 10 },
})

__DEV__ = true
