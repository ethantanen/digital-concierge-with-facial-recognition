
const ply = require('../utilities/polly')
const apis = require('../apis/index')

async function fulfill (req, res, next){
  switch (req.session.intent) {
    case 'LogOff':
      logOff(req, res, next)
      break
    case 'SendEmail':
      sendEmail(req,res,next)
      break
    case 'CheckWeather':
      break
    case 'Joke':
      getJoke(req, res, next)
      break
    case 'SendSlack':
      //sendSlack()
      break
    case 'Emotions':
      emotions(req, res, next)
      break


    default: res.end()
  }
}

// calvin logs you off!
async function logOff(req, res, next) {
  req.session.destroy()
  send(req, res, next,'You have been logged off.')

}

// calvin sends an email
async function sendEmail(req, res, next) {
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    send(req, res, next, 'I have sent your email.')
  } else {
    req.session.extendedMessage = true
    send(req, res, next, 'What should the email say?')
  }
}

// calvin says a joke
async function getJoke(req, res, next) {
  response = await apis.getJoke()
  send(req, res, next, response)
}

// calvin tells you about your perty smile
async function emotions(req, res, next) {
  em = req.session.face.FaceDetails[0].Emotions
  em1 = 'I would say you look ' + em[0].Type + ' and I say that with ' + em[0].Confidence.toFixed(4) + ' percent confidence.'
  em2 = 'Heres a list of your emotions in decreasing confidence. You look ' + em[0].Type + ', ' + em[1].Type + ', and ' + em[2].Type + '.'

  // randomly choose a phrase 
  options = [em1, em2]
  index = Math.floor(Math.random()*options.length)
  text = options[index]

  send(req, res, next, text)
}

// generate audio response and send to client
async function send(req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

module.exports = {
  fulfill: fulfill,
}
