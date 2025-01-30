import Radium from 'radium'

const getSumAnimationTime = (...addends) =>
  addends.reduce((acc, curr) => acc + curr, 0)

const fadeInKeyframes = Radium.keyframes(
  {
    '0%': {
      opacity: 0,
      visibility: 'hidden',
    },
    '100%': {
      opacity: 1,
      visibility: 'visible',
    },
  },
  'fadeIn'
)

const fadeOutKeyframes = Radium.keyframes(
  {
    '0%': {
      opacity: 1,
      visibility: 'visible',
    },
    '100%': {
      opacity: 0,
      visibility: 'hidden',
    },
  },
  'fadeOut'
)

const moveUpDownKeyframes = Radium.keyframes({
  '0%': {
    transform: 'translateY(0)',
  },
  '50%': {
    transform: 'translateY(-10px)',
  },
  '100%': {
    transform: 'translateY(0)',
  },
})

/**
 * get the keyframes for the shake animation
 * hardcoded values are based on the following keyframes
 * 0%, 10%, 65%, 100% {
 *   transform: rotate(0deg) scale(1.0);
 * }
 * 30%, 40% {
 *   transform: rotate(-1deg) scale(1.05);
 *}
 * 35%, 45% {
 *   transform: rotate(1deg) scale(1.05);
 *}
 */
const getShakeKeyframes = ({ animationInSec, startDelay, endDelay }) => {
  const defaultCompletePercent = 65

  const totalAnimationTimeInSec = getSumAnimationTime(
    animationInSec,
    startDelay,
    endDelay
  )

  const startDelayPercent = (100 * startDelay) / totalAnimationTimeInSec

  const animationCompletePercent =
    startDelayPercent + (100 * animationInSec) / totalAnimationTimeInSec

  const regularShapeKey = `0%, ${startDelayPercent}%, ${animationCompletePercent}%, 100%`

  const rotateCounterClockwise = `${
    animationCompletePercent * (30 / defaultCompletePercent)
  }%, ${animationCompletePercent * (40 / defaultCompletePercent)}%`

  const rotateClockwise = `${
    animationCompletePercent * (35 / defaultCompletePercent)
  }%, ${animationCompletePercent * (45 / defaultCompletePercent)}%`

  return Radium.keyframes({
    [regularShapeKey]: {
      transform: 'rotate(0deg) scale(1.0)',
    },
    [rotateCounterClockwise]: {
      transform: 'rotate(-1deg) scale(1.05)',
    },
    [rotateClockwise]: {
      transform: 'rotate(1deg) scale(1.05)',
    },
  })
}

const getLinearGradientKeyframes = ({
  animationInSec,
  delayBetweenAnimationInSec,
}) => {
  const animationCompletePercent =
    delayBetweenAnimationInSec === 0
      ? 100
      : (100 * animationInSec) / delayBetweenAnimationInSec

  const animationCompleteKey = `${animationCompletePercent}%, 100%`

  return Radium.keyframes({
    '0%': { transform: 'translateX(-100%)' },
    [animationCompleteKey]: { transform: 'translateX(100%)' },
  })
}

const fadeIn = (payload = { duration: 300 }) => ({
  animation: `x ${payload.duration}ms ease`,
  animationFillMode: 'forwards',
  animationName: fadeInKeyframes,
})

const fadeOut = (payload = { duration: 300 }) => ({
  animation: `x ${payload.duration}ms ease`,
  animationFillMode: 'forwards',
  animationName: fadeOutKeyframes,
})

export const moveUpDown = () => ({
  animation: 'x 2s ease-in-out infinite',
  animationName: moveUpDownKeyframes,
})

/**
 * a shake animation
 * @param {number} animationInSec - the time it takes to complete the animation
 * @param {number} delayBetweenAnimationInSec - the time between the animation completing and starting again
 * @returns {Object} - the animation style
 */
export const shake = (animationConfig) => {
  const {
    animationInSec = 1.1,
    startDelay = 0.2,
    endDelay = 0.7,
  } = animationConfig ?? {}

  const animationTimeIncludingDelayInSec = getSumAnimationTime(
    animationInSec,
    startDelay,
    endDelay
  )

  const animationName = getShakeKeyframes({
    animationInSec,
    startDelay,
    endDelay,
  })

  return {
    animation: `animate-shake ${animationTimeIncludingDelayInSec}s ease-in-out infinite`,
    animationName,
  }
}

/**
 * animate a linear gradient
 * @param {number} animationInSec - the time it takes to complete the animation
 * @param {number} delayBetweenAnimationInSec - the time between the animation completing and starting again
 * @returns {Object} - the animation style
 */
export const animateGradient = (animationConfig) => {
  const { animationInSec = 1.5, delayBetweenAnimationInSec = 2 } =
    animationConfig ?? {}

  const animationTimeInSec = getSumAnimationTime(
    animationInSec,
    delayBetweenAnimationInSec
  )

  const animationName = getLinearGradientKeyframes({
    animationInSec,
    delayBetweenAnimationInSec,
  })

  return {
    animation: `animate-linear-gradient ${animationTimeInSec}s ease infinite`,
    animationName,
  }
}

export const fade = {
  in: fadeIn,
  out: fadeOut,
}
