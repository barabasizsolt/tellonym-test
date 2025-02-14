import React from 'react'
import { ModalBase, ModalProps } from './ModalBase'
import { useModalVisibility } from './useModalVisibility'

export const ModalInfo: React.FC<ModalProps> = ({ modalVisibleCounter }) => {
  const { isVisible, hide } = useModalVisibility({
    modalVisibleCounter,
    eventName: 'show_modal:Info',
  })

  return (
    <ModalBase
      isVisible={isVisible}
      onClose={hide}
      description="On Tellonym, it's not important what you look like, how many likes you get or how exciting your everyday life is. It's important, who you are, what you think and how you communicate."
      closeCTA={{ text: 'Close', onPress: hide }}
    />
  )
}
