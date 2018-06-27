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

// Custom modules
recc = require('./recognitionController')
s3   = require('./utilities/s3Utilities')
ply  = require('./utilities/pollyUtilities')
register = require('./utilities/register')
ddb = require('./utilities/dynamoDBUtilities')

// Bucket, table and collection name
const NAME = process.env.NAME

// Setup
register.addConversation("greet",[["What's your name?","name"],["What's your number?","number"]],function() {
 return "your name is " + this.answers.name + " and your number is " + this.answers.number
})

/********************************************************
              Application Routing
********************************************************/

// Create express app, add middleware, set view engine
app = express()
app.set('view engine', 'ejs');
app.set('views',__dirname + "/static/views")
app.use(express.static(__dirname + '/static'))
app.use(bodyParser({limit:"50mb"}))

// Begin listening on port 3000
app.listen(3000, (err) => {
  if (err) return console.log("Can't connect to port 3000.",err)
  return console.log("Listening on port 3000")
})

// Home page endpoint
app.get("/", (req, res) => {
  res.render("index.ejs", {})
})

app.post("/s3", (req,res) =>{

  // get base-64 encoded image from request
  buf = new Buffer(req.body.info.split(",")[1], "base64")

  return s3.putObject64(NAME,buf,"gleesh.jpeg")
    .then((data) => {
      /*
       * execute recognition only after the image
       * is successfully placed in the Bucket
       */
     determineIsUser(NAME, NAME, 'gleesh.jpeg')
        .then((data) => {
          console.log("HERE")
          res.send({})
      })
     })
    .catch((err) => {
       console.log(err)
       res.send({})
   })
})

// Endpoint reached when text is submitted
var current = ""
var conver = {}
var term = "stop"
app.post('/conversation', (req, res) => {
  //form = new formidable.IncomingForm
  //return form.parse(req, (err, forms, files) => {

    text = req.body.res
    console.log("HERE", text)

    if(text == term) {
      current =""
      talk("Darling, this conversation is ending!")
    }else{
      if(register.conversations[text]) {
        current=text
        conver=Object.assign({},register.conversations[current])
        talk(conver.next())
      }else{

        conver.answer(text)
        question = conver.next()
        if(question) {
          talk(question)
        }
        else {
          // questioning is over, make api call and read summary
          talk(conver.summary())
          current = ""
        }
      }
    }
    res.send({})
  //})
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
        talk("is user")
          .then((data) => {
            return resolve()
          })

      } else {
        talk("not user")
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
