import { createContext } from 'react'

// Should this allow you to access the cabinet directly?
const CabinetContext = createContext({
  client: null,
  cabinet: null,
  addSubscription: null,
  removeSubscription: null,
})

export default CabinetContext
