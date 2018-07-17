
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
      break
    case 'SendSlack':
      //sendSlack()
      break
    default: res.end()
  }
}

function logOff(req, res, next) {
  req.session.destroy()
  stream = await ply.talk('You\'ve been logged off.')
  res.send({audio: stream, text: 'You\'ve been logged off'})
}

async function sendEmail(req, res, next) {
  console.log("sendemail", req.session)
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    stream = await ply.talk('Ive sent you freakin email')
    res.send({audio: stream})
  } else {
    req.session.extendedMessage = true
    stream = await ply.talk('What should the email say')
    res.send({audio: stream})
  }
}

module.exports = {
  fulfill: fulfill,
}
