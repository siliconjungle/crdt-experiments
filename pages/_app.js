import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { CabinetProvider, CabinetClient } from '../cabinet-client'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

const client = new CabinetClient({ uri: 'wss://silicon-jungle.herokuapp.com' })
// const client = new CabinetClient({ uri: 'ws://localhost:8080' })

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <CabinetProvider client={client}>
      <Component {...pageProps} />
    </CabinetProvider>
  </ChakraProvider>
)

export default MyApp
