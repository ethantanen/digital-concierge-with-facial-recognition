// published modules
const uuidv1 = require('uuid/v1')

// custom modules
const fulfiller = require('./fulfiller').router

// aws utilities
const ply = require('../utilities/polly')
const lex = require('../utilities/lexRuntime')

// router object
const router = require('express').Router()

// route request that are ready for fullfillment
router.use('/fulfill',fulfiller)

// add intents to this list to increase guest permissions
const guestPermissions = ['CreateUser',]

// authenticate users
auth = function(req, res, next){
  if (!req.session.aid && !req.session.guestaid) {
    // generate guest id if the user doesnt ahve an aid
    req.session.guestaid = uuidv1()
  }
  next()
}

/**
 * Endpoint for conversing with lex. The client sends
 * text in the request body, which is fed directly to lex
 * where the user input is validated and then processed
 * accordingly
 */
router.post('/',auth,async (req, res) => {
  // route user and guest conversations accordingly
  if (req.session.aid) {
    // user conversations
    res.redirect(307, req.baseUrl + '/user')
  } else {
    // guest conversations
    res.redirect(307, req.baseUrl + '/guest')
  }
})

// user conversations
router.post('/user', async (req, res) => {
  // grab conversation information
  id = req.session.aid
  text = req.body.text
  meta = req.session.meta

  // make lex request
  lexRes = await lex.postContent(id, text)
  console.log('user:',text, 'calvin:',lexRes.message, 'id:', id)

  // reroute to fulfiller if the intent is ready for fulfillment
  if(lexRes.dialogState === 'ReadyForFulfillment') {
    req.session.intent = lexRes.intentName
    res.redirect('/conversation/fulfill')
  } else {
    res.send({audio: lexRes.audioStream, text: text})
  }

})

// guest conversations
router.post('/guest', async (req, res) => {

  // grab conversation information
  id = req.session.guestaid
  text = req.body.text

  // make lex request
  lexRes = await lex.postContent(id, text)

  // execute this block if the user has permission to do so
  if(guestPermissions.includes(lexRes.intentName)) {

    // return meta data if craeteuser intent is finished gathering information
    if(lexRes.intentName === 'CreateUser' && lexRes.dialogState === 'Fulfilled') {
      response = "Please send me an image to complete the registration process."
      stream = await ply.talk(response)
      res.send({audio: stream, text: response, meta: lexRes.slots})
    } else {
      res.send({audio: lexRes.audioStream, text: lexRes.message})
    }
  } else {
    // return a message that ellicits the users login or account creation
    response = "It appears that you do not have permission to make that request. Please login or create an account to access."
    console.log("guest:",text,"calvin:",response,"id:",id)
    stream = await ply.talk(response)

    console.log(req.session.guestaid)
    res.send({audio: stream, text: response})
  }
})

module.exports = {
  router: router,
}
