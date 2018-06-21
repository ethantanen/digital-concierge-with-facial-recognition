const AWS = require('aws-sdk')
const play = require('audio-play')
const load = require('audio-loader')

// TODO: shouldnt be global, should be parameter
const TABLENAME = "123456testingtesting"

AWS.config.update({
  region: 'us-east-1'
})

// Create Rekognition Service Object
var rk = new AWS.Rekognition({
  apiVersion: '2016-06-27'
})

var polly = new AWS.Polly({
  apiVersion: '2016-06-10'
})

// Synthesize Speech
function synthesizeSpeech(text){
  var params = {
    OutputFormat: "mp3",
    SampleRate: "8000",
    Text: text,
    VoiceId: "Geraint"
  }
  return new Promise((resolve, reject) => {
    polly.synthesizeSpeech(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

function greeting(data) {
  if(data.isUser) {
    gleesh = {USER_ID:data.userId, USER_NAME: "ethan tanen"}
    ddb.getItem(data.userId)
      .then((data) => {
          console.log(data)
          synthesizeSpeech("Hello, " + gleesh.USER_NAME + ". I hope it gleezy!")
      })
      .catch((err) => {
        console.log("ERR", err)
      })
    synthesizeSpeech("Welcom")
  } else {
    gleesh = {USER_ID:data.userId, USER_NAME: "ethan tanen"}
    ddb.putItem(TABLENAME,gleesh)
    console.log("HELLO!!!!")

  }
}
