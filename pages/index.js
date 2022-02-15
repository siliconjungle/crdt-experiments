import React, { useEffect, useState, useCallback } from 'react'
import {
  setState as setShelfState,
  setShelf,
  getShelf,
  addSubscription,
  removeSubscription,
} from '@silicon-jungle/cabinet'

const sendMessage = (connection, message) => {
  if (connection?.readyState === WebSocket.OPEN) {
    connection.send(JSON.stringify(message))
  }
}

// This entire section should be tied to storing values in a cabinet
// Then you should create a useShelf hook.
let connection

// What do I do in the situation where new data has come through but I have made changes? Do I merge the two together?
const init = () => {
  // Load the web page first
  connection = new WebSocket('wss://silicon-jungle.herokuapp.com')
  // connection = new WebSocket('ws://localhost:8080')
  // https://silicon-jungle.herokuapp.com/
  connection.onopen = () => {
    sendMessage(connection, {
      type: 'subscribe',
      data: {
        key: '/',
      },
    })
  }

  connection.onmessage = (event) => {
    const message = JSON.parse(event.data)
    const { type, data } = message
    if (type === 'get') {
      console.log('_DATA_', data)
      const { key, value } = data
      setShelf(key, value)
      console.log(getShelf(key))
    }
  }
}

const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const useShelf = (key, initialValue) => {
  const [value, setInnerValue] = useState(initialValue)

  const callback = useCallback((key, value) => {
    console.log('_CALLBACK_', key, value)
    setInnerValue(value)
  }, [])

  const setValue = value => {
    console.log('_KEY_', key)
    console.log('_VALUE_', value)
    setShelfState(key, value)
    const shelf = getShelf(key)
    sendMessage(connection, {
      type: 'set',
      data: {
        key: '/',
        value: shelf,
      },
    })
  }

  useEffect(() => {
    console.log('_SUB_', key, callback)
    addSubscription(key, callback)
    // Changing the key should remove the subscription too
    // For now just dont' do it.
    return () => {
      console.log('_REMOVE_SUB_')
      removeSubscription(key, callback)
    }
  }, [key, callback])

  return [
    value,
    setValue,
  ]
}

const Home = () => {
  const [data, setData] = useShelf('/', { playerKeys: {} })
  const [publicKey, setPublicKey] = useState(randomRange(0, 999999999))

  const setToKey = useCallback((event) => {
    const playerKeys = { ...data.playerKeys, [publicKey]: event.which }
    setData({ playerKeys })
  }, [publicKey])

  useEffect(() => {
    init()

    document.addEventListener('keyup', setToKey, false)

    return () => {
      document.removeEventListener('keyup', setToKey, false)
    }
  }, [setToKey, publicKey])

  console.log('_DATA_', data)

  return (
    <div>
      Data: {JSON.stringify(data, null, 2)}
    </div>
  )
}

export default Home
