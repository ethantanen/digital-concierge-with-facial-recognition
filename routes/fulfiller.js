
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
      getWeather(req, res, next, req.session.slots.LOCATION)
      break
    case 'Recipe':
      getRecipe(req, res, next, req.session.slots.foodDish)
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
    case 'ChuckNorrisFact':
      getChuckNorrisFact(req, res, next)
      break
    case 'getRonSwansonQuote':
      getRonSwansonQuote(req, res, next)
      break
    case 'GetTimeToDest':
      getTimeToDest(req, res, next, req.session.slots.Location)
      break
    case 'Help':
      help()
      break
    case 'QuoteOfTheDay':
      getQuoteOfTheDay(req, res, next)
      break
    case 'ISSLocation':
      getISSLocation(req, res, next)
      break

    default: send(req, res, next, "Sorry, I dont believe I can help with that right now. Please try again in the future or rephrase your intent.")
  }
}

// get ron swanson quote from the infamous televsion show parks and recreation
async function getRonSwansonQuote(req, res, next) {
  json = await apis.getRonSwansonQuote()
  send(req, res, next, json.txt)
}

// get a random new article
async function getTheNews(req, res, next) {
  json = await apis.getTheNews()
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.text + " " + json.extras})
}

// get international space station location
async function getISSLocation(req, res, next) {
  json = await apis.getISSLocation()
  send(req, res, next, json.text)
}

// get a saucy recipe
async function getRecipe(req, res, next, food) {
  json = await apis.getRecipe(food)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// get a chuck norris joke
async function getChuckNorrisFact(req, res, next) {
  json = await apis.getChuckNorrisFact()
  send(req, res, next, json.text)
}

// returns the number of minutes from ventera to a location
async function getTimeToDest(req, res, next, location) {
  console.log(location)
  json = await apis.getTimeDest(location)
  send(req, res, next, json.text)
}

// get the quote of the day!
async function getQuoteOfTheDay(req, res, next) {
  json = await apis.getQuoteOfTheDay()
  console.log(json)
  send(req, res, next, json.text)
}

// get the weather for a particular location
async function getWeather(req, res, next, location) {
  console.log(location)
  json = await apis.getWeather(location)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})

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
  json = await apis.getJoke()
  send(req, res, next, json.text)
}

// calvin tells you about your perty smile
async function emotions(req, res, next) {

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
