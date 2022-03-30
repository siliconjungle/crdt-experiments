import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { CabinetProvider, CabinetClient, space } from '@silicon-jungle/cabinets-client'
import { socketUrl, serverCabinet, accessToken } from 'config/server'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

const client = new CabinetClient({
  uri: socketUrl,
  cabinet: space.getCabinet(serverCabinet),
  accessToken,
})

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <CabinetProvider client={client}>
      <Component {...pageProps} />
    </CabinetProvider>
  </ChakraProvider>
)

export default MyApp
