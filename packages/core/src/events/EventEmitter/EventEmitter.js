import { EmitterSubscription } from './EmitterSubscription'
import { EventSubscriptionVendor } from './EventSubscriptionVendor'

export class EventEmitter {
  constructor() {
    this._subscriber = new EventSubscriptionVendor()
    this._currentSubscription = null
  }

  /**
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */
  addListener(eventType, listener, context) {
    return this._subscriber.addSubscription(
      eventType,
      new EmitterSubscription(this._subscriber, listener, context)
    )
  }

  /**
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke only once when the
   *   specified event is emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */
  once(eventType, listener, context) {
    const emitter = this
    return this.addListener(eventType, function () {
      emitter.removeCurrentListener()
      listener.apply(context, arguments) // eslint-disable-line prefer-rest-params
    })
  }

  /**
   * @param {?string} eventType - Optional name of the event whose registered
   *   listeners to remove
   */
  removeAllListeners(eventType) {
    this._subscriber.removeAllSubscriptions(eventType)
  }

  removeCurrentListener() {
    this._subscriber.removeSubscription(this._currentSubscription)
  }

  /**
   * @param {string} eventType - Name of the event to query
   * @return {array}
   */
  listeners(eventType) {
    const subscriptions = this._subscriber.getSubscriptionsForType(eventType)
    return subscriptions
      ? subscriptions.map((subscription) => subscription.listener)
      : []
  }

  emit(eventType) {
    const subscriptions = this._subscriber.getSubscriptionsForType(eventType)
    if (subscriptions) {
      const keys = Object.keys(subscriptions)
      for (let ii = 0; ii < keys.length; ii++) {
        const key = keys[ii]
        const subscription = subscriptions[key]
        // The subscription may have been removed during this event loop.
        if (subscription) {
          this._currentSubscription = subscription
          // eslint-disable-next-line prefer-spread
          this.__emitToSubscription.apply(
            this,
            // eslint-disable-next-line prefer-rest-params
            [subscription].concat(Array.prototype.slice.call(arguments))
          )
        }
      }
      this._currentSubscription = null
    }
  }

  /**
   * @param {EmitterSubscription} subscription
   * @param {string} eventType
   * @param {*} Arbitrary arguments to be passed to each registered listener
   */
  //eslint-disable-next-line class-methods-use-this
  __emitToSubscription(subscription) {
    const args = Array.prototype.slice.call(arguments, 2) // eslint-disable-line prefer-rest-params
    subscription.listener.apply(subscription.context, args)
  }
}
