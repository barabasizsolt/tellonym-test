import React from 'react'
import { Button, Text, View } from '../../common'
import { sheets } from '../../common/styles/sheets'
import { ModalDownload } from './modal/ModalDownload'
import { ModalInfo } from './modal/ModalInfo'

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

  _openUserInterviewForm = () => {
    window.open('/userInterView', '_blank')
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
            <Button primary onPress={this._openUserInterviewForm}>
              Open User Interview Form
            </Button>
          </View>
        </View>
      </>
    )
  }
}

export { PageHome }
