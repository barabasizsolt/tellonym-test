export class EventSubscriptionVendor {
  constructor() {
    this._subscriptionsForType = {}
    this._currentSubscription = null
  }

  /**
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */
  addSubscription(eventType, subscription) {
    if (!this._subscriptionsForType[eventType]) {
      this._subscriptionsForType[eventType] = []
    }
    const key = this._subscriptionsForType[eventType].length
    this._subscriptionsForType[eventType].push(subscription)
    subscription.eventType = eventType
    subscription.key = key
    return subscription
  }

  /**
   * @param {?string} eventType - Optional name of the event type whose
   *   registered supscriptions to remove, if null remove all subscriptions.
   */
  removeAllSubscriptions(eventType) {
    if (eventType === undefined) {
      this._subscriptionsForType = {}
    } else {
      delete this._subscriptionsForType[eventType]
    }
  }

  /**
   * @param {object} subscription
   */
  removeSubscription(subscription) {
    const { eventType, key } = subscription
    const subscriptionsForType = this._subscriptionsForType[eventType]

    if (subscriptionsForType) {
      delete subscriptionsForType[key]
    }
  }

  /**
   * @param {string} eventType
   * @return {?array}
   */
  getSubscriptionsForType(eventType) {
    return this._subscriptionsForType[eventType]
  }
}
