import React, { useRef, useEffect, useState, useCallback } from 'react'
import { IconButton, HStack, VStack } from '@chakra-ui/react'
import { GiPaintBucket, GiPencil } from 'react-icons/gi'

const MAP_WIDTH = 24
const MAP_HEIGHT = 24
const TILE_WIDTH = 32
const TILE_HEIGHT = 32

const TOOLS = {
  PENCIL: 'pencil',
  BUCKET: 'bucket',
}
const getMousePosition = (e, offsetX, offsetY) => {
  const mouseX = e.clientX - offsetX
  const mouseY = e.clientY - offsetY
  return {
    x: Math.floor(mouseX / TILE_WIDTH),
    y: Math.floor(mouseY / TILE_HEIGHT),
  }
}

const floodFill = (image, sr, sc, newColor) => {
  // Get the input which needs to be replaced.
  const current = image[sr][sc]

  // If the newColor is same as the existing
  // Then return the original image.
  if (current === newColor) {
    return image
  }

  // Other wise call the fill function which will fill in the existing image.
  fill(image, sr, sc, newColor, current)

  // Return the image once it is filled
  return image
}

const fill = (image, sr, sc, newColor, current) => {
  // If row is less than 0
  if(sr < 0){
    return
  }

  // If column is less than 0
  if(sc < 0){
    return
  }

  // If row is greater than image length
  if(sr > image.length - 1){
    return
  }

  // If column is greater than image length
  if(sc > image[sr].length - 1){
    return
  }

  // If the current pixel is not which needs to be replaced
  if(image[sr][sc] !== current){
    return
  }

  // Update the new color
  image[sr][sc] = newColor


  // Fill in all four directions
  // Fill Prev row
  fill(image, sr - 1, sc, newColor, current)

  // Fill Next row
  fill(image, sr + 1, sc, newColor, current)

  // Fill Prev col
  fill(image, sr, sc - 1, newColor, current)

  // Fill next col
  fill(image, sr, sc + 1, newColor, current)
}

const Canvas = ({ worldMap, onTileChange, floors }) => {
  const ref = useRef(null)
  const [tool, setTool] = useState(TOOLS.PENCIL)
  const [brushTile, setBrushTile] = useState(0)
  const [ctx, setCtx] = useState(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [init, setInit] = useState(false)

  const draw = useCallback(() => {
    ctx.clearRect(0, 0, ref.current.width, ref.current.height)
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        ctx.drawImage(floors[worldMap[x][y]], x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
      }
    }
  }, [ctx, ref, floors, worldMap])

  const handlePencil = (x, y, brush) => {
    if (worldMap[x][y] === brush) {
      return
    }
    const cloneMap = JSON.parse(JSON.stringify(worldMap))
    cloneMap[x][y] = brush
    onTileChange(cloneMap)
    draw(cloneMap)
  }

  const handleBucket = (x, y, brush) => {
    if (worldMap[x][y] === brush) {
      return
    }
    let cloneMap = JSON.parse(JSON.stringify(worldMap))
    cloneMap = floodFill(cloneMap, x, y, brush)
    onTileChange(cloneMap)
    draw(cloneMap)
  }

  const getOffsetPosition = () => {
    const boundingClientRect = ref.current.getBoundingClientRect()
    return { offsetX: boundingClientRect.left, offsetY: boundingClientRect.top }
  }

  const handleMousedown = (e) => {
    setMouseDown(true)
    e.preventDefault()
    e.stopPropagation()
    const { offsetX, offsetY } = getOffsetPosition()
    const { x, y } = getMousePosition(e, offsetX, offsetY)

    if (tool === TOOLS.PENCIL) {
      handlePencil(x, y, brushTile)
    } else if (tool === TOOLS.BUCKET) {
      handleBucket(x, y, brushTile)
    }
  }

  const handleMouseMove = (e) => {
    if (mouseDown) {
      const { offsetX, offsetY } = getOffsetPosition()
      const { x, y } = getMousePosition(e, offsetX, offsetY)

      if (tool === TOOLS.PENCIL) {
        handlePencil(x, y, brushTile)
      } else if (tool === TOOLS.BUCKET) {
        handleBucket(x, y, brushTile)
      }
    }
  }

  const handleMouseUp = (e) => {
    setMouseDown(false)
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMouseOut = (e) => {
    setMouseDown(false)
  }

  useEffect(() => {
    if (ref?.current && !ctx) {
      setCtx(ref.current.getContext('2d'))
    }
  }, [ref, ctx])

  useEffect(() => {
    if (ctx && !init) {
      draw()
      window.addEventListener('visibilitychange', (e) => {
        if (document.visibilityState === 'visible') {
          draw()
        }
      })
      setInit(true)
    }
  }, [ctx, draw, init])

  useEffect(() => {
    if (ctx) {
      draw()
    }
  }, worldMap)

  return (
    <VStack>
      <HStack>
        {floors.map((floor, i) => (
          <IconButton
            colorScheme="blue"
            aria-label="Brush"
            icon={<img src={floor?.src} />}
            onClick={() => setBrushTile(i)}
            key={i}
          />
        ))}
      </HStack>
      <HStack>
        <IconButton
          colorScheme="blue"
          aria-label="Pencil"
          icon={<GiPencil />}
          onClick={() => setTool(TOOLS.PENCIL)}
        />
        <IconButton
          colorScheme="blue"
          aria-label="Fill"
          icon={<GiPaintBucket />}
          onClick={() => setTool(TOOLS.BUCKET)}
        />
      </HStack>
      <canvas
        id="editor"
        ref={ref}
        width={768}
        height={768}
        onMouseDown={handleMousedown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
      />
    </VStack>
  )
}

export default Canvas
