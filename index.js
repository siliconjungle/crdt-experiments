const idEq = (a, agent, seq) => (
  a !== null && (a[0] === agent && a[1] === seq)
)

const findItem = (doc, needle) => {
  if (needle === null) return -1
  else {
    const [agent, seq] = needle

    const idx = doc.content.findIndex(({content, id}) => (
      idEq(id, agent, seq)
    ))
    if (idx < 0) throw Error('Could not find item') // Could use a ternary if not for this!
    return idx
  }
}

// Start at pos and move backwards to the beginning
const findItemAtPos = (doc, pos) => {
  let i
  for (i = 0; i < doc.content.length; i++) {
    if (doc.content[i] === null) continue
    else if (pos === 0) return i
    pos--
  }

  if (pos === 0) return i
  else throw Error('Past end of the document')
}

const integrate = (doc, newItem) => {
  const lastSeen = doc.version[newItem.id[0]] ?? -1
  if (newItem.id[1] !== lastSeen + 1) throw Error('Operations out of order')
  doc.version[newItem.id[0]] = newItem.id[1]

  let left = findItem(doc, newItem.originLeft)
  let destIdx = left + 1
  let right = newItem.originRight === null ? doc.content.length : findItem(doc, newItem.originRight)
  let scanning = false

  // You're not actually exiting out based on a condition...
  for (let i = destIdx; ; i++) {
    // Inserting at the end of the document. Just insert.
    if (!scanning) destIdx = i
    if (i === doc.content.length) break
    if (i === right) break // No ambiguity / concurrency. Insert here.

    let other = doc.content[i]
    let oLeft = findItem(doc, other.originLeft)
    let oRight = newItem.originRight === null ? doc.content.length : findItem(doc, other.originRight)

    if (oLeft < left) {
      // Top row. Insert, insert, arbitrary (insert)
      break
    } else if (oLeft === left) {
      // Middle row.
      if (oRight < right) {
        // This is tricky. We're looking at an item we *might* insert after - but we can't tell yet!
        scanning = true
        continue
      } else if (oRight === right) {
        // Raw conflict. Order based on user agents.
        if (newItem.id[0] < other.id[0]) break
        else {
          scanning = false
          continue
        }
      } else { // oright > right
        scanning = false
        continue
      }
    } else { // oleft > left
      // Bottom row. Arbitrary (skip), skip, skip
      continue
    }
  }

  doc.content.splice(destIdx, 0, newItem)
  doc.length += 1
}

const localInsert = (doc, agent, pos, content) => {
  let i = findItemAtPos(doc, pos)
  integrate(doc, {
    content,
    id: [agent, (doc.version[agent] ?? -1) + 1],
    originLeft: doc.content[i - 1]?.id ?? null,
    originRight: doc.content[i]?.id ?? null,
  }, i)
}

const printDoc = doc => {

}

// const item = {
//   content: '',
//   id: '',
//   originLeft: '', // || null
//   originRight: '', // || null
// }

const createDoc = () => ({
  content: [],
  // Key/Value pair
  // Key is the agent Id
  // Value is the latest sequence number for that agent
  version: {},
  length: 0,
})

export const getContent = doc => (
  doc.content.filter(i => i.content !== null).map(i => i.content)
)

// Not sure that this is necessary...
// Why do I need to check the elements in the array?
// const idEq = (a: Id | null, b: Id | null): boolean => (
//   a == b || (a != null && b != null && a[0] === b[0] && a[1] === b[1])
// )

;(() => {
  // console.clear()

  // const alg = yjs

  let doc1 = createDoc()

  localInsert(doc1, 'a', 0, 'x')
  localInsert(doc1, 'a', 1, 'y')
  localInsert(doc1, 'a', 0, 'z') // zxy

  printDoc(doc1)

//   let doc2 = newDoc()

//   alg.localInsert(doc2, 'b', 0, 'a')
//   alg.localInsert(doc2, 'b', 1, 'b')
//   // alg.localInsert(doc2, 'b', 2, 'c')

//   mergeInto(alg, doc1, doc2)

//   alg.printDoc(doc1)

//   // console.log('\n\n\n')
})()
