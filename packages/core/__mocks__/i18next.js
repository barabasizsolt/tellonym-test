import { __, path } from 'ramda'

const mockedTranslations = {
  ActivationalTells: {
    YWN0aXZhdGlvbmFsX3RlbGw6MA: 'tell1',
    YWN0aXZhdGlvbmFsX3RlbGw6MQ: 'tell2',
  },
}

const I18n = { t: jest.fn(path(__, mockedTranslations)) }

export default I18n
