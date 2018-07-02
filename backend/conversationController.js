/*
 * This is the main controller for Calvin. It is responsible
 * for validating users, managing their session and curating
 * conversation experience.
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
bodyParser = require('body-parser')
express    = require('express')
formidable = require('formidable')
fs         = require('fs')
request    = require('request-promise')
https      = require('https')
cors      = require('cors')

// Custom modules
recc     = require('./recognitionController')
s3       = require('./utilities/s3Utilities')
ply      = require('./utilities/pollyUtilities')
ddb      = require('./utilities/dynamoDBUtilities')
lex      = require('./utilities/lexUtilities')

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
app.set('views',__dirname + "/static/views")
app.use(express.static(__dirname + '/static'))
app.use(bodyParser({limit:"50mb"}))
app.use(cors())

app.listen(8000, (err) => {
  if (err) return console.log(err)
  return console.log("listening on port 8000")
}

/********************************************************
              Facial Recognition/ Authentication
********************************************************/

//TODO: generate auth id, set cookie and create entry in conversation context list of some sort
// Endpoint for facial recognition
app.post("/authenticate", async (req,res) =>{

  // get base-64 encoded image from request
  buf = new Buffer(req.body.info.split(",")[1], "base64")

  // put the base-64 encoded image in the bucket
  await s3.putObject64(NAME,buf,"img.jpeg")
  result = await recc.isUserById(NAME, NAME, "img.jpeg")

  // NOTE: the result object is described in recognitionController.js
  // TODO: what to do after we know if the current user is a user??
  if (result.isUser) {
    stream = await talk("You are a user.")
  } else {
    stream = await talk("You are not a user.")
  }
})

/********************************************************
          Conversation Manager
********************************************************/

/*
 * TODO: validate each request, will need to keep track
 * of the previous prompt from lex. My idea is to simply
 * send the intent and ellicit with each response and have
 * the front side send it right back.
 * NOTE: an example of validation is checking if an email
 * is in the ventera address book before sending the email
 *
 * will also need to check if the conversation is fulfilled
 * and respond accordingly/ make an api call.
 */

 // Conversation endpoint
app.post('/conversation', async (req, res) => {

  // Get users input from request
  text = req.body.text

  // Get Calvin's response
  lexRes = await lex.postText('1234567', text)

  // Grab the message from Calvin's response
  msg = lexRes.message

  // Get Calvin's response
  lexRes = await lex.postText('1234567', text)

  // Grab the message from Calvin's response
  msg = lexRes.message

  // Generate an audio response
  // TODO: lex can do this if a parameter is switched...
  stream = await talk(msg)

  res.send({audio:stream})
})

/********************************************************
              Utility Functions 
********************************************************/

// Synthesize and record a string
async function talk(text){
  data = await ply.synthesizeSpeech(text)
  return data.AudioStream
}
