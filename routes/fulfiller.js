
const ply = require('../utilities/polly')
const apis = require('../apis/index')

async function fulfill (req, res, next){
  console.log("OH ME")
  // list of intents
  functional = {
    'CheckWeather': getWeather,
    'Recipe': getRecipe,
    'GetTimeToDest': getTimeToDest,
    'SendSlack': sendSlackMessage,
    'SendEmail': sendOutlookEmail,
    'LogOff': logOff,
    'Emotions': getEmotions,
    'SearchWiki': searchWiki,
    'TheNews': getTheNews,


  }

  info = {
    'Joke': apis.getJoke,
    'RonSwansonQuote': apis.getRonSwansonQuote,
    'QuoteOfTheDay': apis.getQuoteOfTheDay,
    'ISSLocation': apis.getISSLocation,
  }

  // fulfill intent or issue no intent found message
  if (Object.keys(info).includes(req.session.intent)) {
      func = info[req.session.intent]
      json = await func()
      send(req, res, next, json.text)
  } else  if (Object.keys(functional).includes(req.session.intent)){
      func = functional[req.session.intent]
      func(req, res, next)
  } else {
    send(req, res, next,"Sorry, I dont believe I can help with that right now. Please try again in the future or rephrase your intent.")
  }

}


async function getResponse (req , res, next, func) {
  json = await api.func()
  send(req, res, next, json.text)
}


async function searchWiki(req, res, next) {
  console.log(req.session)
  json = await apis.searchWiki(req.session.slots.searchTopic)
  console.log(JSON.stringify(json))
  send(req, res, next, json.text)
}

// get a random new article
async function getTheNews(req, res, next) {
  json = await apis.getTheNews()
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}



// get a saucy recipe
async function getRecipe(req, res, next) {
  json = await apis.getRecipe(eq.session.slots.foodDish)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// returns the number of minutes from ventera to a location
async function getTimeToDest(req, res, next) {
  json = await apis.getTimeDest(req.session.Location)
  send(req, res, next, json.text)
}



// get the weather for a particular location
async function getWeather(req, res, next) {
  json = await apis.getWeather(req.session.slots.LOCATION)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})

}

// calvin logs you off!
async function logOff(req, res, next) {
  req.session.destroy()
  send(req, res, next,'You have been logged off.')
}

// calvin sends an email
async function sendSlackMessage(req, res, next) {
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    json = await apis.sendSlackMessage(req.session.slots.CHANNEL, req.session.msg)
    send(req, res, next, 'I have sent your message.')
  } else {
    req.session.extendedMessage = true
    send(req, res, next, 'What should the message say?')
  }
}

// send an email using outlook woo!
async function sendOutlookEmail(req, res, next) {
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    json = await apis.sendEmail(req.session.meta.FIRST_NAME + " " + req.session.meta.LAST_NAME,req.session.slots.RECIPIENT, req.session.msg)
    send(req, res, next, 'I have sent your email.')
  } else {
    req.session.extendedMessage = true
    send(req, res, next, 'What should the message say?')
  }
}

// calvin tells you about your perty smile
async function getEmotions(req, res, next) {

  // couple response options
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
