import React from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import {
  VStack,
  Heading,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react'

const Link = ({ href, children }) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink>{children}</ChakraLink>
    </NextLink>
  )
}

const Home = ({ worlds }) => {
  return (
    <>
      <Head>
        <title>Explore worlds</title>
        <meta name="description" content="Explore worlds" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <VStack spacing={4}>
          <Heading as="h1">Explore worlds</Heading>
          {worlds.length ? (
            worlds.map((world, i) => (
              <Link href={world} key={i}>
                {world}
              </Link>
            ))
          ) : (
            <Text>There are currently no worlds - add any slug to the url to edit a world.</Text>
          )}
        </VStack>
      </main>
    </>
  )
}

export const getServerSideProps = async () => {
  // const res = await fetch('http://localhost:8080')
  const res = await fetch('https://silicon-jungle.herokuapp.com')
  const worlds = await res.json()

  return { props: { worlds } }
}

export default Home
