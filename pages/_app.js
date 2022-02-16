import { CabinetProvider, CabinetClient } from '../cabinet-client'

const client = new CabinetClient({ uri: 'wss://silicon-jungle.herokuapp.com' })
// const client = new CabinetClient({ uri: 'ws://localhost:8080' })

const MyApp = ({ Component, pageProps }) => (
  <CabinetProvider client={client}>
    <Component {...pageProps} />
  </CabinetProvider>
)

export default MyApp
