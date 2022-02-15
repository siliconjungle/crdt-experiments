// This is what the frontend API should look like?
/*
const client = new ShelfClient({
  uri: '',
  cache: new InMemoryCache(),
})

<ShelfProvider client={client}>

</ShelfProvider>

const { loading, error, data } = useShelf(key)
 */
const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp
