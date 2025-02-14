import React from 'react'
import { Image as RNI } from 'react-native-web'
import { removeEndingSlash } from '../helpers'
import { Radium } from '../hocs/Radium'

const addCdnUrlIfNoUrlProvided = (source) =>
  source.slice(0, 4) === 'http'
    ? source
    : `${removeEndingSlash(process.env.PUBLIC_URL)}${source}`

export const Image = Radium(({ alt = '', source, ...props }) => (
  <img
    alt={alt}
    src={
      typeof source === 'string'
        ? addCdnUrlIfNoUrlProvided(source)
        : typeof source === 'object'
        ? addCdnUrlIfNoUrlProvided(source.uri)
        : source
    }
    {...props}
  />
))

export const RNImage = Radium(({ alt = '', source, ...props }) => (
  <RNI
    alt={alt}
    source={
      typeof source === 'string'
        ? addCdnUrlIfNoUrlProvided(source)
        : typeof source === 'object'
        ? addCdnUrlIfNoUrlProvided(source.uri)
        : source
    }
    {...props}
  />
))
