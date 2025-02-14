import React from 'react'
import { Analytics } from '../../../common'

export type ModalVisibilityProps = {
  modalVisibleCounter: number
  eventName: string
}

export const useModalVisibility = ({
  modalVisibleCounter,
  eventName,
}: ModalVisibilityProps) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (isVisible) {
      Analytics.addEvent({ name: eventName })
    }
  }, [eventName, isVisible])

  React.useEffect(() => {
    if (modalVisibleCounter > 0) {
      setIsVisible(true)
    }
  }, [modalVisibleCounter])

  return { isVisible, hide: () => setIsVisible(false) }
}
