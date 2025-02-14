import { isObject } from '@tellonym/core/validations'
import React from 'react'
import { history } from './history'

export const minFontSize = 7

export const isSameRouteNavigation = (prevProps, props) =>
  props &&
  props.history &&
  props.history.action === 'REPLACE' &&
  props.location &&
  prevProps &&
  prevProps.location &&
  prevProps.location.pathname === props.location.pathname &&
  prevProps.location.key !== props.location.key

export const getActivityIndicatorBorderWidth = (s) =>
  s <= 50 ? 2 : s <= 75 ? 3 : s <= 100 ? 4 : 6

export const getAdjustedEmojiFontSize = (size) =>
  Math.max(minFontSize, Math.floor(size / 3.5))

export const goBackIfRouteIs = (str) =>
  history.location.pathname.includes(str) && history.goBack(str)

export function onChange(event) {
  this.setState({
    [event.target.name]:
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value,
  })
}

// Object -> Object
export const filterSensitivData = (payload) => {
  if (isObject(payload)) {
    try {
      const filteredPayload = { ...payload }
      if (filteredPayload.accessToken) {
        filteredPayload.accessToken = '*'
      }
      if (filteredPayload.numbers) {
        filteredPayload.numbers = '*'
      }
      if (filteredPayload.password) {
        filteredPayload.password = '*'
      }
      return filteredPayload
    } catch (e) {
      return payload
    }
  }
  return {}
}

const preventDefault = (event) => {
  const e = event || window.event
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.returnValue = false
}

const onScroll = (e) => preventDefault(e)

export const disableScrolling = () => {
  document.addEventListener('touchmove', preventDefault, false)
  window.addEventListener('DOMMouseScroll', onScroll, false)
  window.onmousewheel = onScroll
  document.onmousewheel = onScroll
}

export const enableScrolling = () => {
  document.removeEventListener('touchmove', preventDefault, false)
  window.removeEventListener('DOMMouseScroll', onScroll, false)
  window.onmousewheel = null
  document.onmousewheel = null
}

export const removeEndingSlash = (string) =>
  string.slice(-1) === '/' ? string.slice(-1) : string

export const compressBlob = (blob, quality = 0.7) => {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value(callback, type, quality) {
        const dataURL = this.toDataURL(type, quality).split(',')[1]
        setTimeout(() => {
          const binStr = atob(dataURL)
          const len = binStr.length
          const arr = new Uint8Array(len)

          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i)
          }

          callback(new Blob([arr], { type: type || 'image/png' }))
        })
      },
    })
  }
  return new Promise((resolve) => {
    const image = new Image()
    image.src = window.URL.createObjectURL(blob)
    image.onload = () => {
      const cvs = document.createElement('canvas')
      cvs.width = image.width
      cvs.height = image.height
      const ctx = cvs.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      ctx.canvas.toBlob(resolve, 'image/jpeg', quality)
    }
  })
}

export const resizeImage = (blob, maxSize, iteration = 0) =>
  blob.size > maxSize && iteration <= 9
    ? compressBlob(blob, parseFloat((0.9 - iteration * 0.1).toFixed(1))).then(
        (compressedBlob) => resizeImage(compressedBlob, maxSize, iteration + 1)
      )
    : Promise.resolve(blob)

export const getMainAvatarFileName = (profile) =>
  profile?.avatars?.data?.find((avatar) => avatar.position === 0)
    ?.avatarFileName ?? profile?.avatarFileName

export const LangRerenderCountContext = React.createContext(0)
