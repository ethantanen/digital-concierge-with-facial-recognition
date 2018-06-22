// npm modules
const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')

// Custom modules
const s3 = require('./s3Utilities')
const ddb = require('./dynamoDBUtilities')
const rk = require('./rekognitionUtilities')
const ply = require('./pollyUtilities')
const setup = require('./setup')

// TODO: why!!!! fix this!!!
const NAME = '123456testingtesting'

// Create express object
app = express()

// Middleware for parsing request's body
app.use(bodyParser.json())

// Start server on port 3000
app.listen(3000, (err) => {
  if (err) return console.log(err)
  console.log('Listenting on port 3000')
})

// Setup system with name NAME
// TODO: maybe toss this sucker in a function, when to call?
setup.setup(NAME)
  .then((data) => {
    console.log('System successfully setup!')
  })
  .catch((err) => {
    console.log('System has already been setup with this name.')
  })

// Executes when a new object is added to S3, triggered by Lambda
app.post('/object', (req, res) => {
  isRecognized(req.body)
  res.send('Bucket and Object recieved!')
})

// Checks if face is in system or not
function isRecognized (data) {
  // Table and Bucket have same name
  rk.indexFaces(NAME, NAME, data.object)
    .then((faceInfo) => {
      // Users faceprint id
      userId = faceInfo.FaceRecords[0].Face.FaceId

      // Check if user is already in the database
      ddb.getItem(NAME, userId)
        .then((data) => {
          if (data.Item) {
            // There is data on this mans!
            console.log(userId)
            console.log('USER EXISTS!')

            answer = {isUser:true, user:data}
            speak(answer)

          } else {
            // No data on this mans --> add user to database
            console.log(userId)
            console.log('USER DOESNT EXIST!')

            answer = {isUser:false, user:data}
            speak(answer)

          }
        })
    })
}

function speak(data) {

  var message = ""

  // Determine message based on isUser
  if(data.isUser == true) {
    message = data.USER_NAME + " is a user. Welcome back!"
  } else {
    message = data.USER_NAME + " is not a user. Hopefully you'll join us in the future!"
  }

  ply.synthesizeSpeech(message)
    .then((data) => {
      fs.writeFileSync("gleesh.mp3",data.AudioStream)
      file = fs.readFileSync("gleesh.mp3")
      return s3.putObject(file,NAME,"gleesh.mp3")
        .then((data) => {
          return console.log("Object in bucket!")
        })
        .catch((err) => {
          return console.log("couldnt put object in bucket...",err)
        })
      
    })

}
