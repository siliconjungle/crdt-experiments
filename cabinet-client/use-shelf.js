import { useContext, useState, useCallback, useEffect } from 'react'
import CabinetContext from './cabinet-context.js'

const useShelf = (key, initialValue) => {
  const [value, setInnerValue] = useState(initialValue)
  const {
    client,
    cabinet,
    addSubscription,
    removeSubscription,
  } = useContext(CabinetContext)

  const callback = useCallback((key, value) => {
    setInnerValue(value)
  }, [key])

  const setValue = value => {
    cabinet.setState(key, value)
    const shelf = cabinet.getShelf(key)
    if (client) {
      client.sendMessage({
        type: 'set',
        data: {
          key,
          value: shelf,
        },
      })
    }
  }

  useEffect(() => {
    addSubscription(key, callback)
    // Changing the key should remove the subscription too
    // For now just dont' do it.
    return () => {
      removeSubscription(key, callback)
    }
  }, [key, callback])

  return [
    value,
    setValue,
  ]
}

export default useShelf
