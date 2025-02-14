import React from 'react'
import { ModalBase, ModalProps } from './ModalBase'
import { useModalVisibility } from './useModalVisibility'

const APP_STORE_URL = 'https://apps.apple.com/us/app/tellonym/id1470000000'

export const ModalDownload: React.FC<ModalProps> = ({
  modalVisibleCounter,
}) => {
  const { isVisible, hide } = useModalVisibility({
    modalVisibleCounter,
    eventName: 'show_modal:Download',
  })

  const openAppStore = () => {
    window.open(APP_STORE_URL, '_blank')
  }

  return (
    <ModalBase
      isVisible={isVisible}
      onClose={hide}
      title="Download the App"
      description="Tellonym is also available on the App Store and Play Store. Download the app now to get a better experience right in your pocket."
      closeCTA={{ text: 'No, thanks', onPress: hide }}
      actionCTA={{ text: "Let's go!", onPress: openAppStore }}
    />
  )
}
