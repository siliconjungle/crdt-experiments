import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { VStack, Heading } from '@chakra-ui/react'
import { useShelf } from 'cabinet-client'
import { getTextureImagesByKeys, loadTextures } from 'lib/textures'

const CanvasEditor = dynamic(
  () => import('../components/canvas-editor'),
  { ssr: false },
)

const texturesData = [
  { key: 'floor', filepath: './floor.png' },
  { key: 'floor2', filepath: './floor2.png' },
  { key: 'floor3', filepath: './floor3.png' },
  { key: 'floor4', filepath: './floor4.png' },
  { key: 'floor-snow', filepath: './snow.png' },
  { key: 'floor-lava', filepath: './lava.png' },
  { key: 'floor-water', filepath: './water.png' },
]

const floorNames = [
  'floor',
  'floor2',
  'floor3',
  'floor4',
  'floor-snow',
  'floor-lava',
  'floor-water',
]

const WORLD_MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

const LevelEditor = ({ route }) => {
  const [loading, setLoading] = useState(true)
  const [floors, setFloors] = useState([])
  const [map, setMap] = useShelf(`/${route}`)

  const handleTileChange = elements => {
    setMap(elements)
  }

  const loadGameTextures = async () => {
    await loadTextures(texturesData)
    setFloors(getTextureImagesByKeys(floorNames))
    setLoading(false)
  }

  useEffect(() => {
    loadGameTextures()
  }, [])

  return (
    <VStack spacing={2} align="flex-start">
      {loading ? (
        <div>
          Loading...
        </div>
      ) : (
        <CanvasEditor
          floors={floors}
          worldMap={map || WORLD_MAP}
          onTileChange={handleTileChange}
        />
      )}
    </VStack>
  )
}

const Home = () => {
  const router = useRouter()
  const { route } = router.query
  return (
    <>
      <Head>
        <title>Collaborative level editing</title>
        <meta name="description" content="Collaborative level editing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <VStack spacing={4}>
          <Heading as="h1">Collaborative level editing</Heading>
          {route && <LevelEditor route={route} />}
        </VStack>
      </main>
    </>
  )
}

export default Home
