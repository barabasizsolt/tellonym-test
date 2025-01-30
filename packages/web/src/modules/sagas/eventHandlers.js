import { events } from '@tellonym/core/events'
import { safeEffects } from '@tellonym/core/sagas'

const ready = function* ready() {
  // empty
}

/**
 * This object maps event types to their respective event handler configuration.
 * A configuration is an array with an effect as its first element and optionally
 * a priority handler as its second element.
 * The effect is called with the handler as its first argument.
 * Any other array elements are passed as arguments to the effect call.
 * The event type is always passed as the last argument of the effect call as well.
 * If a handler is passed as the second element it is always executed before any optional module handlers.
 * This allows prioritisation of execution order.
 */
export const rootEventHandler = {
  [events.INIT]: [events.ensure],
  [events.LOAD]: [events.ensure],
  [events.MOUNT]: [events.ensure],
  [events.READY]: [events.ensure, ready],
  [events.AUTH]: [safeEffects.takeEvery],
  [events.UNAUTH]: [safeEffects.takeEvery],
  [events.UPDATE]: [safeEffects.takeEvery],
}
