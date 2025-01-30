import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Radium } from '../hocs/Radium'

export const Icon = Radium((props) => {
  switch (props.font) {
    case 'tello':
      return (
        <i
          className={`icon-${props.name}`}
          /* the height is larger than the fontsize so we force the height & width to be the same */
          style={[
            {
              fontSize: props.size,
              height: props.size,
              width: props.size,
              alignSelf: 'center',
            },
            props.style,
          ]}
        />
      )

    default:
      return <FontAwesomeIcon {...props} />
  }
})
