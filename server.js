import WebSocket, { WebSocketServer } from 'ws'
import {
  setShelf,
  addShelfSubscription,
  removeShelfSubscription,
} from './cabinet.js'

const wss = new WebSocketServer({ port: 8080 })

const getUniqueID = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4();
}

const connections = {}

const addConnection = id => {
  connections[id] = {}
}

const removeConnection = id => {
  delete connections[id]
}

const addSubscriptionToConnection = (id, key) => {
  connections[id][key] = true
}

const removeSubscriptionFromConnection = (id, key) => {
  delete connections?.[id]?.[key]
}

const getSubscriptionsFromConnection = (id) => {
  return Object.keys(connections?.[id]) || []
}

const sendMessage = (ws, message) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  }
}

wss.on('connection', (ws) => {
  ws.id = getUniqueID()
  addConnection(ws.id)

  const subscriptionCallback = (key, value) => {
    console.log('_WS_ID_', ws.id)
    console.log('msg', { type: 'get', data: { key, value } })
    sendMessage(ws, { type: 'get', data: { key, value } })
  }

  // Needs added validation of data
  ws.on('message', (data) => {
    const message = JSON.parse(data)
    if (message.type === 'subscribe') {
      const { key } = message.data
      addSubscriptionToConnection(ws.id, key)
      addShelfSubscription(key, subscriptionCallback)
    } else if (message.type === 'unsubscribe') {
      const { key } = message.data
      removeSubscriptionFromConnection(ws.id, key)
      removeShelfSubscription(key, subscriptionCallback)
    } else if (message.type === 'set') {
      const { key, value } = message.data
      setShelf(key, value)
    }
  })

  ws.on('close', () => {
    const subscriptions = getSubscriptionsFromConnection(ws.id)
    subscriptions.forEach(subscription => {
      removeShelfSubscription(subscription, subscriptionCallback)
    })
    removeConnection(ws.id)
  })
})
