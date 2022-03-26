import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Space from '../cabinet-client/space-singleton'
import { CabinetProvider, CabinetClient } from '../cabinet-client'
import { socketUrl, serverCabinet } from 'config/server'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

const client = new CabinetClient({
  uri: socketUrl,
  cabinet: Space.getCabinet(serverCabinet),
})

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <CabinetProvider client={client}>
      <Component {...pageProps} />
    </CabinetProvider>
  </ChakraProvider>
)

export default MyApp
