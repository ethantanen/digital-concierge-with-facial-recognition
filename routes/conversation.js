// published modules
const uuidv1 = require('uuid/v1')

// custom modules
const fulfiller = require('./fulfiller')

// aws utilities
const ply = require('../utilities/polly')
const lex = require('../utilities/lexRuntime')

// router object
const router = require('express').Router()

// add intents to this list to increase guest permissions
const guestPermissions = ['AddUser',]

// authenticate users and route accordingly
router.use((req, res, next) => {
  console.log('authenticate conversation')
  if (req.session.aid) {
    // is user
    user(req, res, next)
  } else if (req.session.guestaid) {
    // is guest
    guest(req, res, next)
  } else {
    // generate guest id and proceed as guest
    req.session.guestaid = uuidv1()
    guest(req, res, next)
  }
})

// chat with lex with user permissions
function user (req, res, next) {
  if (!req.session.extendedMessage) {
    // proceed as usual
    lexChat(req, res, next)
  } else {
    //fulfill request with extended message --> ex) the body of an email
    req.session.msg = req.body.text
    fulfiller.fulfill(req, res, next)
  }
}

async function guest(req, res, next) {
  // grab conversation information
  id = req.session.guestaid
  text = req.body.text

  // make lex request
  lexRes = await lex.postContent(id, text)

  // execute this block if the user has permission to do so
  if(guestPermissions.includes(lexRes.intentName)) {
    // return meta data if CreateUser intent is finished gathering information
    if(lexRes.intentName === 'AddUser' && lexRes.dialogState === 'Fulfilled') {
      response = "Please send me an image to complete the registration process."
      stream = await ply.talk(response)
      res.send({audio: stream, text: response, meta: lexRes.slots})
    } else {
      stream = await ply.talk(lexRes.message)
      res.send({audio: stream, text: lexRes.message})
    }
  } else {
    // return a message that ellicits the users login or account creation
    response = "It appears that you do not have permission to make that request. Please login or create an account to access."
    stream = await ply.talk(response)
    res.send({audio: stream, text: response})
  }
}

// send text to chatbot and fulfill request when necessary
async function lexChat (req, res, next) {
  // extract user info from session
  id = req.session.id
  text = req.body.text
  meta = req.session.meta

  // send text to lex chatbot
  lexRes = await lex.postContent(id, text)
  // check if entries are ready for fulfillment
  if(lexRes.dialogState === 'ReadyForFulfillment') {
    // fulfill request
    console.log(lexRes.intentName)
    req.session.intent = lexRes.intentName
    fulfiller.fulfill(req, res, next)
  } else {
    //send lex's response back to user
    stream = await ply.talk(lexRes.message)
    res.send({audio: stream, text: lexRes.message})
  }
}

module.exports = {
  router: router,
}
