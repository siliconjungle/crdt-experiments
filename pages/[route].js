import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { VStack, Heading } from '@chakra-ui/react'
import { useShelf } from '../cabinet-client'
import { getTextureImagesByKeys, loadTextures } from '../lib/textures'

const CanvasEditor = dynamic(
  () => import('../components/canvas-editor'),
  { ssr: false },
)

const texturesData = [
  { key: 'character-male', filepath: './character.png' },
  { key: 'character-female', filepath: './character2.png' },
  { key: 'pillar', filepath: './pillar-full.png' },
  { key: 'plant', filepath: './plant.png' },
  { key: 'robot', filepath: './robot.png' },
  { key: 'player', filepath: './player.png' },
  { key: 'james', filepath: './james.png' },
  { key: 'floor', filepath: './floor.png' },
  { key: 'floor2', filepath: './floor2.png' },
  { key: 'floor3', filepath: './floor3.png' },
  { key: 'floor4', filepath: './floor4.png' },
  { key: 'floor-snow', filepath: './snow.png' },
  { key: 'floor-lava', filepath: './lava.png' },
  { key: 'wall-skull', filepath: './skull.png' },
  { key: 'wall-skull2', filepath: './skull2.png' },
  { key: 'wall-skull3', filepath: './skull3.png' },
  { key: 'wall', filepath: './wall.png' },
  { key: 'wall2', filepath: './wall2.png' },
  { key: 'wall3', filepath: './wall3.png' },
  { key: 'wall4', filepath: './wall4.png' },
  { key: 'wall5', filepath: './wall5.png' },
  { key: 'wall6', filepath: './wall6.png' },
  { key: 'wall7', filepath: './wall7.png' },
  { key: 'wall8', filepath: './wall8.png' },
  { key: 'pillar-broken', filepath: './pillar-broken.png' },
  { key: 'pillar-broken2', filepath: './pillar-broken2.png' },
  { key: 'floor-water', filepath: './water.png' },
  { key: 'wall-green', filepath: './wall-green.png' },
  { key: 'wall-green2', filepath: './wall-green2.png' },
  { key: 'wall-green3', filepath: './wall-green3.png' },
  { key: 'wall-green4', filepath: './wall-green4.png' },
  { key: 'wall-green5', filepath: './wall-green5.png' },
  { key: 'wall-green6', filepath: './wall-green6.png' },
  { key: 'wall-green7', filepath: './wall-green7.png' },
  { key: 'wall-green8', filepath: './wall-green8.png' },
  { key: 'wall-green9', filepath: './wall-green9.png' },
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

// const randomRange = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }

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

const MAP_WIDTH = 24
const MAP_HEIGHT = 24

const convertDataToMap = data => {
  if (!data) {
    return null
  }

  const map = []

  const xValues = Object.keys(data)

  for (let x = 0; x < xValues.length; x++) {
    const row = []
    const yValues = Object.keys(data[x])
    for (let y = 0; y < yValues.length; y++) {
      row.push(data[x][y])
    }
    map.push(row)
  }


  return map
}

const convertMapToData = map => {
  if (!map) {
    return null
  }

  const data = {}
  for (let x = 0; x < MAP_WIDTH; x++) {
    data[x] = {}
    for (let y = 0; y < MAP_HEIGHT; y++) {
      data[x][y] = map[x][y]
    }
  }
  return data
}

const LevelEditor = () => {
  const router = useRouter()
  const { route } = router.query
  const [loading, setLoading] = useState(true)
  const [floors, setFloors] = useState([])
  const [data, setData] = useShelf(`/${route}`, convertMapToData(WORLD_MAP))
  const [map, setMap] = useState(WORLD_MAP)

  const handleTileChange = elements => {
    const mapData = convertMapToData(elements)
    setData(mapData)
  }

  const loadGameTextures = async () => {
    await loadTextures(texturesData)
    setFloors(getTextureImagesByKeys(floorNames))
    setLoading(false)
  }

  useEffect(() => {
    loadGameTextures()
  }, [])

  useEffect(() => {
    // const map = convertDataToMap(data)
    setMap(convertDataToMap(data))
  }, [data])

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
          <LevelEditor />
        </VStack>
      </main>
    </>
  )
}

export default Home
