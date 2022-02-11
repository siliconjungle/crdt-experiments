import EventEmitter from 'events'
import {
  createShelf,
  getDataFromShelf,
  mergeShelves,
  diffShelfAndData,
} from './shelf.js'

const shelfEmitter = new EventEmitter()
shelfEmitter.setMaxListeners(0)

const emitter = new EventEmitter()
emitter.setMaxListeners(0)

// Functions can subscribe to a shelf (or potentially a query?)
// Should store data in a database / file of some kind.
// I want to be able to differentiate between local changes and ones that I want to sync across the network?
// Is that necessary?
// If so, can that be achieved with branches?
// Cabinets can optionally have a url added
// Should transclusion be a thing? Not sure if it's needed.
const store = {}

export const getState = (key) => store[key] && getDataFromShelf(store[key]) || null

export const setState = (key, state) => {
  store[key] = store[key] ? mergeShelves(store[key], diffShelfAndData(store[key], state)) : createShelf(state)
  shelfEmitter.emit(
    key,
    key,
    store[key],
  )
  emitter.emit(
    key,
    key,
    getState(key),
  )
}

export const getShelf = (key) => store[key] || null

export const setShelf = (key, shelf) => {
  store[key] = store[key] ? mergeShelves(store[key], shelf) : shelf
  shelfEmitter.emit(
    key,
    key,
    store[key],
  )
  emitter.emit(
    key,
    key,
    getState(key),
  )
}

export const addSubscription = (key, callback) => {
  emitter.addListener(key, callback)
}

export const removeSubscription = (key, callback) => {
  emitter.removeListener(key, callback)
}

export const addShelfSubscription = (key, callback) => {
  shelfEmitter.addListener(key, callback)
}

export const removeShelfSubscription = (key, callback) => {
  shelfEmitter.removeListener(key, callback)
}
