/*
 * This is the main controller for Calvin. It is responsible
 * for validating users, managing their session and curating
 * conversation experiences.
 */

 /*
  * TODO: add cookies with time limit that adds a few minutes each time
  * the users makes a request. The state of the users experience (facial
  * features, authorization information, account information?) should be
  * stored in a temporary data structure that exists only for the duration
  * of the interaction. Make middleware that determines if a user is authenticated
  * and request authentication if the user is not.
  */

// Published modules
const bodyParser = require('body-parser')
const express    = require('express')
const formidable = require('formidable')
const fs         = require('fs')
const https      = require('https')
const cors       = require('cors')

// Custom modules
const recc     = require('./recognitionController')
const addUser  = require('./addUserController')
const s3       = require('./utilities/s3Utilities')
const ply      = require('./utilities/pollyUtilities')
const ddb      = require('./utilities/dynamoDBUtilities')
const lex      = require('./utilities/lexRuntimeUtilities')

/********************************************************
              Application/ Environment Setup
********************************************************/

// Bucket, table and collection name
const NAME = process.env.NAME

/*
 * Create express app, add middleware and static
 * file directory
 */
app = express()
app.use(bodyParser({limit:"50mb"}))
app.use(cors())

var server = app.listen(3000, function (err) {
  if (err) return console.log('Couldn\'t start server")
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

/********************************************************
              Custom Middleware
********************************************************/
//NOTE: Not functional yet!
// Check to see if the user is authorized to make a request
/*
app.use(async (req, res, next) => {
  cookie = req.cookies.auth
  if (cookie) {
    next()
  } else {
    stream = await talk ("It appears you are not authorized to continue. If you are a returning user\
      please authenticate yourself with an image of yourself. If your are not a returning user please\
      join by clicking the add user button!")
    res.send({audio: stream})
  }
  */
})

/********************************************************
                Add User
********************************************************/
app.post("/addUser", async (req, res) => {

  try {

    meta = req.body.meta
    image = new Buffer(req.body.image.split(',')[1],"base64")

    // add image to bucket
    await s3.putObject64(NAME, image, "img.jpeg")

    // add user to database
    user = await addUser.addUser(NAME, NAME, "img.jpeg", meta)
    res.send({audio: await talk(user.name + "added to the system.")})
  } catch (err) {
    console.log(err)
    res.send({audio: await talk('I was unable to add you to the system.')})
  }

})

/********************************************************
              Facial Recognition/ Authentication
********************************************************/

//TODO: generate auth id, set cookie and create entry in conversation context list of some sort
// Endpoint for facial recognition/ authentication
app.post("/authenticate", async (req,res) => {

  // get base-64 encoded image from request
  buf = new Buffer(req.body.image.split(",")[1], "base64")

  // put the base-64 encoded image in the bucket
  await s3.putObject64(NAME,buf,"img.jpeg")
  result = await recc.isUserById(NAME, NAME, "img.jpeg")

  //TODO: issue greeting!
  // NOTE: the result object is described in recognitionController.js
  if (result.isUser) {
    //TODO: generate auth id, set cookie, add conversation to context
    stream = await talk("You are a user.")
    res.send({audio: stream})
  } else {
    stream = await talk("You are not a user.")
    res.send({audio: stream})
  }
})

/********************************************************
          Conversation Manager
********************************************************/

 // Conversation endpoint
app.post('/conversation', async (req, res) => {

  // Get users input from request
  text = req.body.text

  //TODO: conversation context will determine the conversation id
  // Get Calvin's response
  lexRes = await lex.postText('1234567', text)

  // Get Calvin's response
  lexRes = await lex.postText('1234567', lexRes.message)

  // If the discourse is create user and the discource has ended send the meta back to the front
  if(lexRes.intentName === "CreateUser" && lexRes.dialogState === "Fulfilled"){
    res.send({audio:lexRes.audioStream, meta: lexRes.slots})
  } else {
    res.send({audio: lexRes.audioStream})
  }
})

/********************************************************
              Utility Functions
********************************************************/

// Synthesize and record a string
async function talk(text){
  data = await ply.synthesizeSpeech(text)
  return data.AudioStream
}
