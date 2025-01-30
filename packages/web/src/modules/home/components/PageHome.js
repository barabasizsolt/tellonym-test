import React from 'react'
import { Analytics, Button, Text, View } from '../../common'
import { sheets } from '../../common/styles/sheets'

const APP_STORE_URL = 'https://apps.apple.com/us/app/tellonym/id1470000000'
const NOTION_CONCEPT_LINK =
  'https://tellonym.notion.site/Test-Task-User-Interview-Page-95a3e35ac0034edfade08ab20b2a7fcd'

const styles = {
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-around',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  containerDesktop: { maxWidth: '70%', alignSelf: 'center' },
  description: {
    marginTop: 12,
    marginBottom: 12,
  },
  headline: {
    marginBottom: 12,
  },
  innerContainer: {
    alignItems: 'center',
    maxWidth: '80%',
  },
  link: {
    textDecoration: 'underline',
  },
}

const H2 = ({ children }) => {
  return (
    <Text type="h2" bold style={{ marginTop: 24, marginBottom: 12 }}>
      {children}
    </Text>
  )
}

const ModalDownload = ({ modalVisibleCounter }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const hide = () => {
    setIsVisible(false)
  }

  const openAppStore = () => {
    window.open(APP_STORE_URL, '_blank')
  }

  const stopPropagation = (e) => {
    e.stopPropagation()
  }

  React.useEffect(() => {
    if (isVisible) {
      Analytics.addEvent({ name: 'show_modal:Download' })
    }
  }, [isVisible])

  React.useEffect(() => {
    if (modalVisibleCounter > 0) {
      setIsVisible(true)
    }
  }, [modalVisibleCounter])

  if (!isVisible) {
    return null
  }

  return (
    <View
      onPress={hide}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        onPress={stopPropagation}
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          maxWidth: 360,
          padding: 16,
          margin: 32,
        }}>
        <Text type="h1" center bold>
          Download the App
        </Text>
        <Text center style={styles.description}>
          Tellonym is also available on the App Store and Play Store. Download
          the app now to get a better experience right in your pocket.
        </Text>
        <View style={styles.buttonContainer}>
          <Button gray onPress={hide}>
            No, thanks
          </Button>
          <Button onPress={openAppStore}>Let's go!</Button>
        </View>
      </View>
    </View>
  )
}

const ModalInfo = ({ modalVisibleCounter }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const hide = () => {
    setIsVisible(false)
  }

  const stopPropagation = (e) => {
    e.stopPropagation()
  }

  React.useEffect(() => {
    if (isVisible) {
      Analytics.addEvent({ name: 'show_modal:Info' })
    }
  }, [isVisible])

  React.useEffect(() => {
    if (modalVisibleCounter > 0) {
      setIsVisible(true)
    }
  }, [modalVisibleCounter])

  if (!isVisible) {
    return null
  }

  return (
    <View
      onPress={hide}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        onPress={stopPropagation}
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          maxWidth: 360,
          padding: 16,
          margin: 32,
        }}>
        <Text center style={styles.description}>
          On Tellonym, it's not important what you look like, how many likes you
          get or how exciting your everyday life is. It's important, who you
          are, what you think and how you communicate.
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Button gray onPress={hide} style={{ marginTop: 12 }}>
            Close
          </Button>
        </View>
      </View>
    </View>
  )
}

class PageHome extends React.Component {
  state = {
    modalDownloadVisibleCounter: 0,
    modalInfoVisibleCounter: 0,
  }

  _showModalDownload = () => {
    this.setState((state) => ({
      modalDownloadVisibleCounter: state.modalDownloadVisibleCounter + 1,
    }))
  }

  _showModalInfo = () => {
    this.setState((state) => ({
      modalInfoVisibleCounter: state.modalInfoVisibleCounter + 1,
    }))
  }

  _openNotion = () => {
    window.open(NOTION_CONCEPT_LINK, '_blank')
  }

  render() {
    return (
      <>
        <ModalDownload
          modalVisibleCounter={this.state.modalDownloadVisibleCounter}
        />
        <ModalInfo modalVisibleCounter={this.state.modalInfoVisibleCounter} />
        <View desktopStyle={styles.containerDesktop} style={styles.container}>
          <View style={styles.innerContainer}>
            <Text type="h1" bold style={styles.headline}>
              Tellonym Home
            </Text>
            <Text style={sheets.margin.bottom[8]}>
              Welcome to the Tellonym Test Task. We wish you the best of luck!
            </Text>
            <Text style={sheets.margin.bottom[32]}>
              Checkout the{' '}
              <Text bold onPress={this._openNotion} style={styles.link}>
                notion page
              </Text>{' '}
              for the task details.
            </Text>
            <H2>Task 1</H2>
            <Text center style={styles.description}>
              Modals for task 1
            </Text>
            <View style={styles.buttonContainer}>
              <Button onPress={this._showModalDownload}>Download App</Button>
              <Button onPress={this._showModalInfo}>Get Info</Button>
            </View>
            <H2>Task 2</H2>
            <Text center style={styles.description}>
              Add a new page to the project and create a button below that
              navigates to your new page.
            </Text>
          </View>
        </View>
      </>
    )
  }
}

export { PageHome }
