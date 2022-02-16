import React, { useState } from 'react'
import { useShelf } from '../cabinet-client'

const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const Home = () => {
  const [data, setData] = useShelf('/', { playerKeys: {} })
  const [publicKey, setPublicKey] = useState(randomRange(0, 999999999))

  const setToKey = (event) => {
    const playerKeys = { ...data?.playerKeys, [publicKey]: event.which }
    setData({ playerKeys })
  }

  return (
    <pre
      style={{ backgroundColor: 'rgb(66, 135, 245)', minHeight: '500px' }}
      onKeyPress={setToKey}
      tabIndex={0}
    >
      Data: {JSON.stringify(data, null, 2)}
    </pre>
  )
}

export default Home
