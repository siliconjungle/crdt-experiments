const isObj = data =>
  typeof data && typeof data === 'object' && !Array.isArray(data)

export const compareShelves = (shelf, shelf2) => {
  if (shelf) {
    if (shelf2) {
      if (shelf[1] > shelf2[1]) {
        return 1
      } else if (shelf2[1] > shelf[1]) {
        return -1
      }
      if (isObj(shelf[0])) {
        if (isObj(shelf2[0])) {
          return 0
        }
        return 1
      } else if (isObj(shelf2[0])) {
        return -1
      }
      // Can something more explicit be added here?
      // This relies too heavily on JS implementation of stringify.
      // This makes it harder for other languages to be interoperable.
      const shelfJson = JSON.stringify(shelf[0])
      const shelf2Json = JSON.stringify(shelf2[0])
      if (shelfJson === shelf2Json) {
        return 0
      }
      return shelfJson < shelf2Json ? 1 : -1
    }
    return 1
  }
  if (shelf2) {
    return -1
  }
  return 0
}

export const createShelf = (data, objectVersion = 0) => {
  return (
    [
      isObj(data) ?
        Object.entries(data).reduce((p, [k, v]) => {
          return ({
            ...p,
            [k]: isObj(v) ? createShelf(v) : [v, 0],
          })
        }, {}) :
        data,
      objectVersion,
    ]
  )
}

export const getDataFromShelf = shelf => {
  return isObj(shelf[0]) ? (
    Object.entries(shelf[0]).reduce((p, [k, v]) => {
      if (v[0] === null) {
        return {
          ...p,
        }
      }
      return {
        ...p,
        [k]: isObj(v[0]) ? getDataFromShelf(v) : v[0],
      }
    }, {})
  ) : shelf[0]
}

// This diff creates a shelf that contains the changes which would be applied for a merge.
export const diffShelves = (shelf, shelf2) => {
  // Only return fields that belong to 2
  // Or that belong to 1 and don't belong to 2
  if (!shelf && !shelf2) {
    return null
  }
  const shelfOrder = compareShelves(shelf, shelf2)
  if (shelfOrder === 1) {
    return null
  } else if (shelfOrder === -1) {
    return shelf2
  }

  if (JSON.stringify(shelf[0]) === JSON.stringify(shelf2[0])) {
    return [null, shelf2[1]]
  }

  const keys = [
    ...new Set(
      [
        ...Object.keys(shelf[0]),
        ...Object.keys(shelf2[0])
      ]
    )
  ]
  return [
    keys.reduce((p, key) => {
      const shelfOrder2 = compareShelves(shelf[0][key], shelf2[0][key])
      if (shelfOrder2 === 1 || JSON.stringify(shelf[0][key]) === JSON.stringify(shelf2[0][key])) {
        return {
          ...p,
        }
      }
      return {
        ...p,
        [key]: diffShelves(shelf[0][key] || null, shelf2[0][key] || null),
      }
    }, {}),
    shelf[1]
  ]
}

export const mergeShelves = (shelf, shelf2) => {
  if (!shelf && !shelf2) {
    return null
  }
  const shelfOrder = compareShelves(shelf, shelf2)
  if (shelfOrder === 1) {
    return shelf
  } else if (shelfOrder === -1) {
    return shelf2
  }

  if (JSON.stringify(shelf[0]) === JSON.stringify(shelf2[0])) {
    return shelf2
  }

  const keys = [
    ...new Set(
      [
        ...Object.keys(shelf[0]),
        ...Object.keys(shelf2[0]),
      ]
    )
  ]
  return [
    keys.reduce((p, key) => {
      return {
        ...p,
        [key]: mergeShelves(shelf[0][key] || null, shelf2[0][key] || null),
      }
    }, {}),
    shelf[1],
  ]
}

// Apply local changes
// Loop through all keys
// If key belongs to shelf then set data's version to shelf +1
// If it doesn't, set data's version to 0
export const diffShelfAndData = (shelf, data) => {
  if (!shelf) {
    return [data, 0]
  }

  if (!isObj(data)) {
    return shelf[0] === data ? [data, shelf[1]] : [data, shelf[1] + 1]
  }

  if (!isObj(shelf[0])) {
    return createShelf(data, shelf[1] + 1)
  }

  const keys = [
    ...new Set(
      [
        ...Object.keys(shelf[0]),
        ...Object.keys(data),
      ]
    )
  ]

  return [
    keys.reduce((p, key) => {
      return {
        ...p,
        [key]: diffShelfAndData(shelf[0][key] || null, data[key] || null),
      }
    }, {}),
    shelf[1],
  ]
}

// const diffShelfAndData = (shelf, data) => {
//   if (!isObj(data)) {
//
//   }
//
//   const keys = [
//     ...new Set(
//       [
//         ...Object.keys(shelf[0]),
//         ...Object.keys(data),
//       ]
//     )
//   ]
//   return [
//     keys.reduce((p, key) => {
//       return {
//         ...p,
//         [key]: diffShelfAndData(shelf[0][key] || null, data[key] || null),
//       }
//     }, {}),
//     shelf[1] + 1,
//   ]
// }

// const player = {
//   x: 50,
//   y: 50,
//   color: {
//     r: 255,
//     g: 0,
//     b: 0,
//   },
// }
//
// console.log(
//   '_PLAYER_',
//   JSON.stringify(
//     player,
//     null,
//     2,
//   )
// )
//
// const playerShelf = createShelf(player)
//
// console.log(
//   '_SHELF_1_',
//   JSON.stringify(
//     playerShelf,
//     null,
//     2,
//   )
// )
//
// const playerShelf2 = JSON.parse(JSON.stringify(playerShelf))
// playerShelf2[0].x[0] = 100
// playerShelf2[0].color[0].b[1] = 1
// playerShelf2[0].color[0].b[0] = 255
// // delete playerShelf2[0].color[0].g
// playerShelf2[0].color[0].g[0] = null
// playerShelf2[0].color[0].g[1] = 1
//
// console.log(
//   '_SHELF_2_',
//   JSON.stringify(
//     playerShelf2,
//     null,
//     2,
//   )
// )
//
// const mergedShelf = mergeShelves(playerShelf, playerShelf2)
//
// console.log(
//   '_MERGED_',
//   JSON.stringify(
//     mergedShelf,
//     null,
//     2,
//   )
// )
//
// const shelfData = getDataFromShelf(mergedShelf)
// console.log(
//   '_SHELF_DATA_',
//   JSON.stringify(
//     shelfData,
//     null,
//     2
//   )
// )
//
// const shelfChanges = diffShelves(playerShelf, playerShelf2)
// console.log(
//   '_SHELF_CHANGES_',
//   JSON.stringify(
//     shelfChanges,
//     null,
//     2,
//   )
// )
//
// shelfData.x = 10
// shelfData.color.g = 55
// const diffedShelfAndData = diffShelfAndData(mergedShelf, shelfData)
// console.log(
//   '_DIFFED_SHELF_AND_DATA_',
//   JSON.stringify(
//     diffedShelfAndData,
//     null,
//     2,
//   )
// )

// const playerX = createShelf(10)
// const playerX2 = createShelf(20)
// const playerX3 = createShelf(30, 1)
// console.log('_PLAYER_X_', playerX)
// console.log('_PLAYER_X_2_', playerX2)
// console.log('_PLAYER_X_3_', playerX3)
// const dataX = getDataFromShelf(playerX)
// console.log('_DATA_X_', dataX)
// const mergedShelf = mergeShelves(playerX, playerX2)
// console.log('_MERGED_SHELF_', mergedShelf)
// const mergedShelf2 = mergeShelves(playerX2, playerX3)
// console.log('_MERGED_SHELF_2_', mergedShelf2)
// const shelfData = getDataFromShelf(mergedShelf)
// console.log('_SHELF_DATA_', shelfData)
// const shelfData2 = getDataFromShelf(mergedShelf2)
// console.log('_SHELF_DATA_2_', shelfData2)
// const shelfChanges = diffShelves(playerX2, playerX3)
// console.log('_SHELF_CHANGES_', shelfChanges)
// const diffedShelfAndData = diffShelfAndData(mergedShelf2, shelfData2)
// console.log('_DIFFED_SHELF_AND_DATA_', diffedShelfAndData)
