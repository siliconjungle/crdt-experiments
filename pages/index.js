import React, { useEffect, useState } from 'react'
import {
  getState as getShelfState,
  setState as setShelfState,
  setShelf,
  getShelf,
  addSubscription,
  removeSubscription,
} from '../cabinet'

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
  connection = new WebSocket('ws://localhost:8080')

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
      const { key, value } = data
      setShelf(key, value)
    }
  }
}

const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const useShelf = (key, initialValue) => {
  const [value, setInnerValue] = useState(initialValue)

  const callback = (key, value) => {
    setInnerValue(value)
  }

  const setValue = value => {
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
    addSubscription(key, callback)
    // Changing the key should remove the subscription too
    // For now just dont' do it.
    return () => {
      removeSubscription(key, callback)
    }
  }, [key])

  return [
    value,
    setValue,
  ]
}

const Home = () => {
  const [pos, setPos] = useShelf('/', 0)

  const generateRandomValue = () => {
    setPos(randomRange(0, 100))
  }

  useEffect(() => {
    init()

    document.addEventListener('keyup', generateRandomValue, false)

    return () => {
      document.removeEventListener('keyup', generateRandomValue, false)
    }
  }, [])

  return (
    <div>
      Pos: {pos}
    </div>
  )
}

export default Home
