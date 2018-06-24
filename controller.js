/*
 * This is the main controller for Calvin.
 * This file receives the call from the lambda function
 * and redirects the response accordingly. That is, it
 * determines if the image from lambda is in fact a user
 * and executes either greeting or user setup response
 * before entering the conversation loop.
 */

// Published modules
express = require('express')
body-parser = require('body-parser')

// Custom modules
recc = require('./recognitionController')
conc = require('./conversationController')

// Bucket, table and collections name
const NAME = process.env.NAME
// Create express app, add middleware and begin listening on port 3000
app = express()
app.use(bodyParser.json())
app.listen(3000, (err) => {
  if (err) return console.log("Can't connect to port 3000.",err)
  return console.log("Listening on port 3000")
})

// Function called by lambda
app.post("/object", (req, res) => {
  imageInfo = req.body
  console.log("received image: ", imageInfo)
  isUser(NAME, NAME, imageInfo.object)
  res.send("Image info received!")
})

// Redirects to the conversation controller
function isUser(collection, bucket, image) {
  recc.isUserByImage(image)
    .then((res) => {
      /*
       * Greet the user if they're in the system and create
       * a new user if they're not in the system.
       */
      if(res.isUser) {
        conc.greet(res.id)
      } else {
        conc.newUser(res.id)
      }
    })
}
