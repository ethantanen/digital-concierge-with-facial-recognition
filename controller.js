const express = require('express')

const s3 = require("./s3Controller")
const ddb = require("./dynamoDBController")
const rk = require("./rekognitionController")


app = express()

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
  if (err) return console.log(err)
  console.log("Listening on")
})

app.get("/", (req, res) => {
  console.log(req.query)
  res.send("SUCCESS!")
})
