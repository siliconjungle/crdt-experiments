import React, { useCallback } from 'react'
import * as cabinet from '@silicon-jungle/cabinet'
import CabinetContext from './cabinet-context.js'

const CabinetProvider = ({ client, children }) => {
  const addSubscription = useCallback((key, callback) => {
    if (client && cabinet.getSubscriptionCount(key) === 0) {
      client.subscribe(key)
    }
    cabinet.addSubscription(key, callback)
  }, [client])

  const removeSubscription = useCallback((key, callback) => {
    cabinet.removeSubscription(key, callback)
    if (client && cabinet.getSubscriptionCount(key) === 0) {
      client.unsubscribe(key)
    }
  }, [client])

  const value = {
    client,
    cabinet,
    addSubscription,
    removeSubscription,
  }

  return (
    <CabinetContext.Provider value={value}>
      {children}
    </CabinetContext.Provider>
  )
}

export default CabinetProvider
