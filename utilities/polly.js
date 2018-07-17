/*
 * synthesizeSpeech
 */

// Published modules
const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1'
})

// Create Polly service object
var polly = new AWS.Polly({
  apiVersion: '2016-06-10'
})

// Synthesize Speech
function synthesizeSpeech (text) {
  var params = {
    OutputFormat: 'mp3',
    SampleRate: '8000',
    Text: text,
<<<<<<< HEAD:utilities/polly.js
    VoiceId: 'Matthew'
=======
    VoiceId: 'Geraint'
>>>>>>> eef4620fe9796d4716d4296c2c93a3f4f347a0f2:backend/utilities/pollyUtilities.js
  }
  return new Promise((resolve, reject) => {
    polly.synthesizeSpeech(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

/**
 * This function uses polly to convert text to
 * speech
 */
async function talk(text){
  data = await synthesizeSpeech(text)
  return data.AudioStream
}

module.exports = {
  synthesizeSpeech: synthesizeSpeech,
  talk: talk
}
