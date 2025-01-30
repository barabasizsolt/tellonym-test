import React from 'react'
import { withRouter } from 'react-router'
import { Slide, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createStore } from 'redux'
import { I18n } from '../locales/I18n'
import { Card } from './Card'
import { ModalOption } from './ModalOption'
import { Overlay } from './Overlay'
import { Text } from './Text'

const pathnameToHasNoAlert = (pathname) =>
  ['/stream'].some((route) => pathname.includes(route))

const initialState = {
  options: {
    confirmText: I18n.t('Common.confirm'),
    dismissText: I18n.t('Common.cancel'),
    hasLater: false,
    isCancelable: true,
    isDismissable: false,
    laterText: I18n.t('Common.later'),
  },
  isVisible: false,
  resolve: (payload) => Promise.resolve(payload),
  text: '',
  title: '',
  queue: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        ...state,
        isVisible: true,
        ...action.payload,
        options: {
          ...state.options,
          ...action.payload.options,
        },
      }
    case 'HIDE':
      return { ...initialState, queue: state.queue.slice(1) }
    default:
      return state
  }
}

const store = createStore(reducer)

const show = (payload) => store.dispatch({ type: 'SHOW', payload })

const hide = (payload) => {
  store.getState().resolve(payload)
  store.dispatch({ type: 'HIDE' })
  const state = store.getState()
  if (state.queue.length) {
    show(state.queue[0])
  }
}

const CONFIRMED = 'CONFIRMED'
const DISMISSED = 'DISMISSED'
const IGNORED = 'IGNORED'
const LATER = 'LATER'

const alert = (title, text, options) =>
  new Promise((resolve) => {
    const state = store.getState()
    const isQueued = state.queue.some(
      (alert) => alert.title === title && alert.text === text
    )
    if (isQueued) {
      resolve(IGNORED)
    } else {
      state.queue.push({ title, text, options, resolve })
      if (!store.getState().isVisible && state.queue.length) {
        show(state.queue[0])
      }
    }
  })

const reload = () =>
  alert(I18n.t('Lightbox.Error.text'), I18n.t('doYouWantToReload'), {
    isDismissable: true,
  }).then((payload) => payload === CONFIRMED && window.location.reload())

const AlertContainer = () => (
  <ToastContainer
    autoClose={1750}
    closeOnClick
    draggable
    hideProgressBar={false}
    newestOnTop={false}
    pauseOnFocusLoss={false}
    pauseOnHover={false}
    position="top-center"
    rtl={false}
    theme="colored"
    transition={Slide}
  />
)
class _Alert extends React.Component {
  static alert = alert
  static reload = reload
  static info = toast.info
  static warning = toast.warning

  static error = (msg = I18n.t('Common.error'), config) =>
    toast.error(msg, config)
  static success = (msg = I18n.t('Common.success'), config) =>
    toast.success(msg, config)

  static CONFIRMED = CONFIRMED
  static DISMISSED = DISMISSED
  static IGNORED = IGNORED
  static LATER = LATER

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { isVisible, options, title, text } = store.getState()

    if (pathnameToHasNoAlert(this.props.location.pathname)) {
      return null
    }

    return (
      <React.Fragment>
        <AlertContainer />
        {isVisible && (
          <Overlay onPress={() => options.isDismissable && hide(DISMISSED)}>
            <Card
              onPressClose={
                options.isDismissable ? () => hide(DISMISSED) : undefined
              }>
              <Text type="h2" style={{ marginBottom: 24 }}>
                {title}
              </Text>
              <Text style={{ marginBottom: 24 }}>{text}</Text>
              <ModalOption onPress={() => hide(CONFIRMED)} hasBorderTop>
                {options.confirmText}
              </ModalOption>
              {options.hasLater && (
                <ModalOption onPress={() => hide(LATER)} hasBorderTop>
                  {options.laterText}
                </ModalOption>
              )}
              {options.isCancelable && (
                <ModalOption onPress={() => hide(DISMISSED)} hasBorderTop>
                  {options.dismissText}
                </ModalOption>
              )}
            </Card>
          </Overlay>
        )}
      </React.Fragment>
    )
  }
}

export const Alert = withRouter(_Alert)
