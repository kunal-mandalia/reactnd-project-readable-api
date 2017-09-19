const clone = require('clone')

let db = {}

const defaultData = {
  "894tuq4ut84ut8v4t8wun89g": {
    id: '894tuq4ut84ut8v4t8wun89g',
    parentId: "8xf0y6ziyjabvozdd253nd",
    timestamp: 1505363915440,
    body: `You could wrap your component in a Provider and pass in a mock store (checkout redux-mock-store)`,
    author: 'ninja.js',
    voteScore: 12,
    deleted: false,
    parentDeleted: false 
  },
  "8tu4bsun805n8un48ve89": {
    id: '8tu4bsun805n8un48ve89',
    parentId: "8xf0y6ziyjabvozdd253nd",
    timestamp: 1504763915440,
    body: `Thanks @ninja.js I gave that a go. It works but I can't access the state of my component, I've only got access to the Provider connected state if that makes sense`,
    author: 'whitehat',
    voteScore: 5,
    deleted: false,
    parentDeleted: false
  },
  "8tu4bsun805n8un48ve90": {
    id: '8tu4bsun805n8un48ve90',
    parentId: "6ni6ok3ym7mf1p33lnez",
    timestamp: 1502763915440,
    body: `I've been writing in assembly for the past 5 years so this is pretty easy for me.`,
    author: 'creativeg',
    voteScore: -4,
    deleted: false,
    parentDeleted: false
  },
  "8tu4bsun805n8un48ve91": {
    id: '8tu4bsun805n8un48ve91',
    parentId: "6ni6ok3ym7mf1p33lnez",
    timestamp: 1505763915440,
    body: `Something like 8-12hrs/week but it varies a lot between modules. I spent much longer on Readable than Myreads for example.`,
    author: 'reasonableperson',
    voteScore: 3,
    deleted: false,
    parentDeleted: false
  }
}

function getData (token) {
  let data = db[token]
  if (data == null) {
    data = db[token] = clone(defaultData)
  }
  return data
}

function getByParent (token, parentId) {
  return new Promise((res) => {
    let comments = getData(token)
    let keys = Object.keys(comments)
    filtered_keys = keys.filter(key => comments[key].parentId === parentId && !comments[key].deleted)
    res(filtered_keys.map(key => comments[key]))
  })
}

function get (token, id) {
  return new Promise((res) => {
    const comments = getData(token)
    res(
      comments[id].deleted || comments[id].parentDeleted
        ? {}
        : comments[id]      
      )
  })
}

function add (token, comment) {
  return new Promise((res) => {
    let comments = getData(token)

    comments[comment.id] = {
      id: comment.id,
      timestamp: comment.timestamp,
      body: comment.body,
      author: comment.author,
      parentId: comment.parentId,
      voteScore: 1,
      deleted: false,
      parentDeleted: false
    }
     
    res(comments[comment.id])
  })
}

function vote (token, id, option) {
  return new Promise((res) => {
    let comments = getData(token)
    comment = comments[id]
    switch(option) {
        case "upVote":
            comment.voteScore = comment.voteScore + 1
            break
        case "downVote":
            comment.voteScore = comment.voteScore - 1
            break
        default:
            console.log(`comments.vote received incorrect parameter: ${option}`)
    }
    res(comment)
  })
}

function disableByParent (token, post) {
    return new Promise((res) => {
        let comments = getData(token)
        keys = Object.keys(comments)
        filtered_keys = keys.filter(key => comments[key].parentId === post.id)
        filtered_keys.forEach(key => comments[key].parentDeleted = true)
        res(post)
    })
}

function disable (token, id) {
    return new Promise((res) => {
      let comments = getData(token)
      comments[id].deleted = true
      res(comments[id])
    })
}

function edit (token, id, comment) {
    return new Promise((res) => {
        let comments = getData(token)
        for (prop in comment) {
            comments[id][prop] = comment[prop]
        }
        res(comments[id])
    })
}

module.exports = {
  get,
  getByParent,
  add,
  vote,
  disableByParent,
  disable,
  edit
}