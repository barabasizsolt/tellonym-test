import React from 'react'
import { View, Text, Button } from '../../../common'

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxWidth: 360,
    padding: 16,
    margin: 32,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    width: '100%',
  },
  description: {
    marginTop: 12,
    marginBottom: 12,
  },
}

export type CtaProps = {
  text: string
  onPress: () => void
}

export type ModalBaseProps = {
  isVisible: boolean
  onClose: () => void
  title?: string
  description: string
  closeCTA: CtaProps
  actionCTA?: CtaProps
}

export type ModalProps = {
  modalVisibleCounter: number
}

export const ModalBase: React.FC<ModalBaseProps> = ({
  isVisible,
  onClose,
  title,
  description,
  closeCTA,
  actionCTA,
}) => {
  if (!isVisible) {
    return null
  }

  return (
    <View onTouchEnd={onClose} style={styles.container}>
      <View
        onTouchEnd={(e: React.TouchEvent) => e.stopPropagation()}
        style={styles.content}>
        {title && (
          <Text type="h1" center bold>
            {title}
          </Text>
        )}
        <Text center style={styles.description}>
          {description}
        </Text>
        <View
          style={[
            styles.buttonContainer,
            { justifyContent: actionCTA ? 'space-around' : 'center' },
          ]}>
          <Button gray onPress={closeCTA.onPress}>
            {closeCTA.text}
          </Button>
          {actionCTA && (
            <Button onPress={actionCTA.onPress}>{actionCTA.text}</Button>
          )}
        </View>
      </View>
    </View>
  )
}
