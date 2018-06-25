/*
 * This is the main controller for Calvin.
 * This file receives the call from the lambda function
 * and redirects the response accordingly. That is, it
 * determines if the image from lambda is in fact a user
 * and executes conversation protocol accordingly.
 */

// Published modules
express = require('express')
bodyParser = require('body-parser')

// Custom modules
recc = require('./utilities/recognitionController')
conc = require('./utilites/conversationController')

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
  isUser(NAME, NAME, imageInfo.object)
  res.send("Image info received!")
})

// Redirects to the conversation controller
function isUser(collection, bucket, image) {
  recc.isUserById(collection,bucket,image)
    .then((res) => {
     /*
      * treat user differently if they're
      * new or returning.
      */
      if(res.isUser) {
        isUser(res.id)
      } else {
        isNotUser(res.id)
      }
    })
}

function isUser(id) {
  console.log("Returning User!", id)
  /*
   * retrieve users information from table and enter
   * conversation loop
   */
}

function isNotUser(id) {
  console.log("New User!", id)
  /*
   * prompt if users wants to be added to the system.
   * may be next version b/c new user input requires
   * coordinating many events.
   */
}

// Get conversation

// Prompt question

// Execute conversation
/*
 * loop through conversation prompting questions and
 * records responses in a JavaScript object/dict. Make
 * function call using object's values as parameters.
 */
