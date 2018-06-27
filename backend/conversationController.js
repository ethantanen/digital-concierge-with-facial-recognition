/*
 * This is the main controller for Calvin.
 * This file receives the call from the lambda function
 * and redirects the response accordingly. That is, it
 * determines if the image from lambda is in fact a user
 * and executes conversation protocol accordingly.
 */

// Published modules
bodyParser = require('body-parser')
express    = require('express')
formidable = require('formidable')
fs         = require('fs')
request    = require('request-promise')
https      = require('https')

// Custom modules
recc     = require('./recognitionController')
s3       = require('./utilities/s3Utilities')
ply      = require('./utilities/pollyUtilities')
register = require('./utilities/register')
ddb      = require('./utilities/dynamoDBUtilities')

/********************************************************
              Application/ Environment Setup
********************************************************/

// Bucket, table and collection name
const NAME = process.env.NAME

/*
 * Create express app, add middleware, set view engine
 * and static file directory
 */
app = express()
app.set('view engine', 'ejs');
app.set('views',__dirname + "/static/views")
app.use(express.static(__dirname + '/static'))
app.use(bodyParser({limit:"50mb"}))

/*
 * NOTE: openssl req -nodes -new -x509 -keyout server.key -out server.cert
 * --> use this to generate a self signed certificate
 */
 // Begin https server on port 3000
https.createServer({
  key: fs.readFileSync('./encryption/server.key'),
  cert: fs.readFileSync('./encryption/server.cert')
},app)
.listen(3000, (err) => {
  if (err) return console.log("Can't connect to port 3000.",err)
  return console.log("Listening on port 3000")
})

/********************************************************
              Application Routing
********************************************************/

// Home page endpoint
app.get("/", (req, res) => {
  res.render("index.ejs", {})
})

// Endpoint for facial recognition
app.post("/s3", (req,res) =>{

  // get base-64 encoded image from request
  buf = new Buffer(req.body.info.split(",")[1], "base64")

  // put object in s3 bucket before recognition analysis
  return s3.putObject64(NAME,buf,"img.jpeg")
    .then((data) => {
      /*
       * execute recognition only after the image
       * is successfully placed in the Bucket
       */
     determineIsUser(NAME, NAME, 'img.jpeg')
        .then((data) => {
          res.send({})
      })
     })
    .catch((err) => {
       console.log(err)
       res.send({error: "Error with recognition"})
     })
})

/********************************************************
            Adding Conversations to Register
********************************************************/
var conversations = register.getConversations()

conversations.add("checkin", [["Hello, how are you?","feeling"],["And hows the homestead?","fam"]], function() {
  return "So your family is " + this.answers.fam + " and your feeling " + this.answers.feeling
})
conversations.add("add", [["What's the first number?","num1"],["and what is the second number?","num2"]], function() {
  return "The sum of " + this.answers.num1 + " and " + this.answers.num2 + " is " +  (parseInt(this.answers.num1) + parseInt(this.answers.num2))
})
conversations.add("help", [["Click submit and I'll tell you what I can help with!","num1"]], function() {
  return "checkin, add, and help"
})

// Current conversation information TODO: none of this should be global!!
var conversation = []
var term = "stop" // terminate conversation word
var isTalk = false //boolean for if conversation is in progress

// Conversation endpoint
//TODO: redo all of this cuz it ugly!!!
app.post('/conversation', (req, res) => {
    // Users response
    text = req.body.res
    // Always terminate if text is the termination string
    if (text === term) {
      conversation = []
      isTalk = false
      return talk("Darling, this conversation is ending.")
        .then(() => {
          res.send({})
        })
    } else {
      // Check if users in a conversation
      if (!isTalk) {
        // Conversation hasn't started, check if input is a callword
        if(Object.keys(conversations.conversations).includes(text)) {
          // text is a callword and begin the conversation
          isTalk = true
          conversation = conversations.conversations[text]
          talk(conversation.next())
            .then(()=>{
              res.send({})
            })
        }else{
          return talk("Please input a valid callword.")
            .then((data) => {
              res.send({})
            })
        }
      } else {
        // Record answer in conversation object
        conversation.answer(text)
        // In conversation mode
        if(conversation.end != true) {
          //conversations still going
          talk(conversation.next())
            .then(()=>{
              res.send({})
            })
        } else {
          // Orate conversation summary and reset isTalk and conversation variables
          talk(conversation.summary())
            .then(() => {
              conversation = []
              isTalk = false
              res.send({})
            })
        }
      }
    }
})

/********************************************************
              Application Functionality
********************************************************/

// Synthesize and record a string
function talk(text){
  return ply.synthesizeSpeech(text)
    .then((data) => {
      fs.writeFileSync("static/audio/speech.mp3",data.AudioStream)
    })
    .catch((err) => {
      console.log(err)
    })
}

// Redirects to the conversation controller
function determineIsUser(collection, bucket, image) {
  return new Promise((resolve,reject) => {
   recc.isUserById(collection,bucket,image)
    .then((res) => {
      // treat user differently if they're new or returning
      if(res.isUser) {
        ddb.getItem(NAME,res.id)
          .then((data) => {
            // TODO: create conversation w/ user entry from table aswell as analysis from rekog.  
            talk("Welcome back! " + data.Item.USER_NAME.S + " its damn good to see u. Lets talk!")
              .then((data) => {
                return resolve()
              })
          })
      } else {
        talk("It appears your not a user. Hopefully you will join us in the future! but Lets talk anyway!")
          .then((data) => {
            return resolve()
          })
      }
    })
    .catch((err) => {
      reject(err)
    })
  })
}
