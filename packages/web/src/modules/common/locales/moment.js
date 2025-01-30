import moment from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

moment.extend(relativeTime)
moment.extend(advancedFormat)

export { moment }
