import { getShelf, setShelf } from '@silicon-jungle/cabinet'

const isBrowser = typeof window !== 'undefined'

function CabinetClient (options) {
  if (isBrowser) {
    this.messages = []
    this.connection = new WebSocket(options.uri)

    this.connection.onmessage = event => {
      const message = JSON.parse(event.data)
      const { type, data } = message
      if (type === 'get') {
        const { key, value } = data
        setShelf(key, value)
        console.log(getShelf(key))
      }
    }

    // Should I stack up the messages if not connected?
    // I feel like not only should this happen, but also, all changes to state should synchronise
    // The current setup feels quite frail.
    this.connection.onopen = event => {
      // Subscriptions should occur
      this.messages.forEach(message => {
        this.sendMessage(message)
      })
    }
  }

  this.sendMessage = message => {
    if (this.connection?.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message))
    } else {
      this.messages.push(message)
    }
  }

  this.subscribe = key => {
    this.sendMessage({
      type: 'subscribe',
      data: { key },
    })
  }

  this.unsubscribe = key => {
    this.sendMessage({
      type: 'unsubscribe',
      data: { key },
    })
  }

  this.uri = options.uri
}

export default CabinetClient
