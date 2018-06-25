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
recc = require('./recognitionController')

// Bucket, table and collections name
const NAME = process.env.NAME

// Create express app, add middleware and begin listening on port 3000
app = express()
app.use(bodyParser())
app.listen(3000, (err) => {
  if (err) return console.log("Can't connect to port 3000.",err)
  return console.log("Listening on port 3000")
})

/*
 * Lambda no longer necessary due to architecture
 * redesign.
 */
/*
// Function called by lambda
app.post("/object", (req, res) => {
  console.log("Lambda hook received...")
  imageInfo = req.body
  determineIsUser(NAME, NAME, imageInfo.object)
  res.send("Image info received!")
})
*/

/*
 * WARNING: there may be issues with the value of key if
 * there are multiple requests to this endpoint at the same
 * time due to the putObject64 promise.
 */
// New image endpoint
app.post("/image", (req, res) => {

  // Images key
  key = req.body.key

  // Base-64 encoded image as text
  img_64_string = req.body.image.split(",")[1]

  // Convert text to buffer
  img_64_buffer = new Buffer(img_64_string,"base64")

  // Use s3 utiltiies to put object in bucket
  s3.putObject64(NAME,img_64_buffer,key)
    .then((data) => {
      console.log("Image put in bucket...!")
      determineIsUser(NAME, NAME, key )
    })
    .catch((err) => {
      console.log("ERR",err)
    })
})

// Redirects to the conversation controller
function determineIsUser(collection, bucket, image) {
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
