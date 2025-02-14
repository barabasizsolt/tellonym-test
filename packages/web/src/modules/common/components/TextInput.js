import React from 'react'
import Radium from 'radium'

const styles = {
  input: {
    padding: '20px',
    fontSize: '16px',
    border: '1px solid #f5f5f5',
    borderRadius: '5px',
    backgroundColor: '#f5f5f5',
    ':focus': {
      borderColor: '#FF005A',
      outline: 'none',
    },
  },
}

const TextInput = Radium(({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={styles.input}
  />
))

export default Radium(TextInput)
