/** @constant {string} INIT Store is initialized. Also triggered by headless task. */
export const INIT = 'events/INIT'
/** @constant {string} LOAD Data is rehydrated. Also triggered by headless task. */
export const LOAD = 'events/LOAD'
/** @constant {string} MOUNT Root did mount. */
export const MOUNT = 'events/MOUNT'
/** @constant {string} NAVIGATION Navigation occurred. */
export const NAVIGATION = 'events/NAVIGATION'
/** @constant {string} NAVIGATION_READY Navigation ref is ready to use. */
export const NAVIGATION_READY = 'events/NAVIGATION_READY'
/** @constant {string} BOTTOM_TAB_PRESS TabBarBottom element has been pressed. */
export const BOTTOM_TAB_PRESS = 'events/BOTTOM_TAB_PRESS'
/** @constant {string} BOTTOM_TAB_DOUBLE_PRESS TabBarBottom element has been double pressed. */
export const BOTTOM_TAB_DOUBLE_PRESS = 'events/BOTTOM_TAB_DOUBLE_PRESS'
/** @constant {string} TOP_TAB_PRESS TabBarTop element has been pressed. */
export const TOP_TAB_PRESS = 'events/TOP_TAB_PRESS'
/** @constant {string} READY Root did mount and data is rehydrated. */
export const READY = 'events/READY'
/** @constant {string} AUTH User is either already authenticated on LOAD or did just authenticate. */
export const AUTH = 'events/AUTH'
/** @constant {string} UNAUTH LOGOUT_SUCCESS or REMOVE_ACCOUNT_SUCCESS was just called. */
export const UNAUTH = 'events/UNAUTH'
/** @constant {string} START User is ready for first session since boot, either because he is logged in or because he finished the onboarding flow. */
export const START = 'events/START'
/** @constant {string} SESSION Directly after START and when user opened app after being in background for a prolonged time. */
export const SESSION = 'events/SESSION'
/** @constant {string} MAIN_NAVIGATOR_AVAILABLE The main navigator became available. */
export const MAIN_NAVIGATOR_AVAILABLE = 'events/MAIN_NAVIGATOR_AVAILABLE'
/** @constant {string} MAIN_NAVIGATOR_UNAVAILABLE The main navigator became unavailable. */
export const MAIN_NAVIGATOR_UNAVAILABLE = 'events/MAIN_NAVIGATOR_UNAVAILABLE'
/** @constant {string} INITIAL_SCREEN_INTERACTIVE The initial screen of the main navigator became interactive for the first time since MAIN_NAVIGATOR_AVAILABLE. */
export const INITIAL_SCREEN_INTERACTIVE = 'events/INITIAL_SCREEN_INTERACTIVE'
/** @constant {string} BACKGROUND App was put into background. */
export const BACKGROUND = 'events/BACKGROUND'
/** @constant {string} FOREGROUND App was brought to the foreground. */
export const FOREGROUND = 'events/FOREGROUND'
/** @constant {string} CONTINUATION App was brought to the foreground after being in the background for a while, but not long enough to count as a resume or new session. */
export const CONTINUATION = 'events/CONTINUATION'
/** @constant {string} RESUME App was brought to the foreground during a session after being in the background for a while, but not long enough to count as a new session. */
export const RESUME = 'events/RESUME'
/** @constant {string} UPDATE App received latest update. */
export const UPDATE = 'events/UPDATE'
/** @constant {string} UPDATE_REQUEST App requests latest updates from API. For internal usage. */
export const UPDATE_REQUEST = 'events/UPDATE_REQUEST'
/** @constant {string} UPDATE_ERROR Something went wrong with update request. For internal usage. */
export const UPDATE_ERROR = 'events/UPDATE_ERROR'
/** @constant {string} SCREENSHOT User took a screenshot. */
export const SCREENSHOT = 'events/SCREENSHOT'
/** @constant {string} MODAL_OPEN A Modal opened. */
export const MODAL_OPEN = 'events/MODAL_OPEN'
/** @constant {string} MODAL_CLOSE A Modal closed. */
export const MODAL_CLOSE = 'events/MODAL_CLOSE'
