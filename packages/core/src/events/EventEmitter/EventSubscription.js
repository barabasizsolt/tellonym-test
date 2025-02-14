export class EventSubscription {
  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */
  constructor(subscriber) {
    this.subscriber = subscriber
  }

  remove() {
    if (this.subscriber) {
      this.subscriber.removeSubscription(this)
      this.subscriber = null
    }
  }
}
