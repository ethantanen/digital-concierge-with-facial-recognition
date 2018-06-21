// npm modules
const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')

// Custom modules
const s3 = require('./s3Utilities')
const ddb = require('./dynamoDBUtilities')
const rk = require('./rekognitionUtilities')
const setup = require('./setup')

// TODO: why!!!! fix this!!!
const NAME = 'testingtesting'

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
//TODO: maybe toss this sucker in a function, when to call?
setup.setup(NAME)
  .then((data) => {
    console.log('System successfully setup!')
  })
  .catch((err) => {
    console.log('System has already been setup with this name.')
  })

// Executes when a new object is added to S3, triggered by Lambda
app.post('/object', (req, res) => {
  isRecognize(req.body)
  res.send('Bucket and Object recieved!')
})

// Checks if face is in system or not
function isRecognized (data) {

	// TODO: should NAME be here or should data.bucket be replaced w/ NAME
  rk.indexFaces(NAME, data.bucket, data.object)
    .then((faceInfo) => {

      // Users faceprint id
      userId = faceInfo.FaceRecords[0].Face.FaceId

      // TODO: delete me!
      ddb.putItem(NAME, {USER_ID: userId, USER_NAME: 'ethan!'})

      // Check if user is already in the database
      ddb.getItem(userId)
        .then((data) => {
          console.log('data: ', data)

          if (data.Item) {
						// There is data on this mans!
						console.log(userId)
						console.log("USER EXISTS!")
						console.log("DATA: ", JSON.stringify(data,null,2))


          } else {
						// No data on this mans --> add user to database
						console.log(userId)
						console.log("USER DOESNT EXIST!")
						console.log("DATA: ", JSON.stringify(data,null,2))
					}
        })
    })
}
