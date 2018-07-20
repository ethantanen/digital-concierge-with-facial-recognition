
const ply = require('../utilities/polly')
const apis = require('../apis/index')
const users = require('../models/users')

async function fulfill (req, res, next){
  console.log(req.session.intent)
  // intents for which only data is retrieved (no additional paramters or function calls)
  info = {
    'Joke': apis.getJoke,
    'RonSwansonQuote': apis.getRonSwansonQuote,
    'QuoteOfTheDay': apis.getQuoteOfTheDay,
    'ISSLocation': apis.getISSLocation,
    'GetQuote': apis.getQuote,
  }

  // list of intents that require either a function call or paramter for the api
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
    'Dictionary': getDefinition,
    'DownloadRepo': downloadRepo,
    'FindEmail': getUsersByName,
    'FindJobTitle': getUsersByPosition,
    'FindLastName': getUsersByName,
    'Stop': stop,
  }



  // fulfill intent or issue no intent found message
  if (Object.keys(info).includes(req.session.intent)) {
    // intent requires a simple api get request
    func = info[req.session.intent]
    json = await func()
    send(req, res, next, json.text)
  } else  if (Object.keys(functional).includes(req.session.intent)){
    // function requires additional work and functions are defined below
    func = functional[req.session.intent]
    func(req, res, next)
  } else {
    // a handler does not exist for these intents
    send(req, res, next,"Sorry, I dont believe I can help with that right now. Please try again in the future or rephrase your intent.")
  }
}

// get the defintion of a word
async function getDefinition(req, res, next) {
  word = req.session.slots.WORD
  json = await apis.getDefinition(word)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// make an api request (defined in seperate file) and send the response to the client
async function getResponse (req , res, next, func) {
  json = await api.func()
  send(req, res, next, json.text)
}

// query wikipedia
async function searchWiki(req, res, next) {
  json = await apis.searchWiki(req.session.slots.searchTopic)
  send(req, res, next, json.text)
}

// get a random new article
async function getTheNews(req, res, next) {
  json = await apis.getTheNews()
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: "<a href='" + json.extras + "'> Visit Article </a>"})
}

// get a saucy recipe
async function getRecipe(req, res, next) {
  json = await apis.getRecipe(req.session.slots.foodDish)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// get the number of minutes from ventera to a location
async function getTimeToDest(req, res, next) {
  json = await apis.getTimeDest(req.session.slots.Location)
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
async function sendOutlookEmail (req, res, next) {
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
async function getEmotions (req, res, next) {

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

// get the link to download the CALVIN repo
async function downloadRepo (req, res, next) {
  text = "Please click on the provided link to download my git repository. Have fun with it!"
  extras = "Download my innards: <a href='https://github.com/ethantanen/File-Share-API/zipball/master'>click me </a>"
  stream = await ply.talk(text)
  res.send({audio: stream, text: extras})
}

// generate audio response and send to client
async function send(req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

// query the database for a user with the provided name
async function getUsersByName(req, res, next) {

  name = req.session.slots.firstName
  list = await users.scanUsersByName(name)

  if (list.length == 0) return send(req, res, next, "I could not find anyone named " + name)

  text = "The first person with the name " + name + " has the following email address: " + list[0].EMAIL
  stream = await ply.talk(text)
  res.send({audio: stream, text: JSON.stringify(list,null,1)})
}

// query the database for a user with the provided position
async function getUsersByPosition (req, res, next) {

  position = req.session.slots.jobTitle
  list = await users.scanUsersByPosition(position)

  if (lisst.length == 0) return send(req, res, next, "I could not find any with the following position: " + position)

  text = "The first person that fits that description is " + list[0].FIRST_NAME + " " + list[0].LAST_NAME + ". They are a "  + list[0].POSITION + " and their email is " + list[0].EMAIL
  extras = JSON.stringify(list,null,1)
  stream = await ply.talk(text)
  res.send({audio: stream, text: extras})

}

// stop the current intent 
function stop (req, res, next) {
  res.send({audio: undefined, text: "Intent ended. Ask me anything!"})
}

// // create graphing calculator getContext
// async function grapher(req, ers, next) {
//   extras =
//   '<div id="calculator" style="width:400; height:200px;"></div>' +
//   '<script>' +
//     ""
//     "var elt = document.getElementById('calculator'); elt.keypad=false" +
//     "var calculator = Desmos.GraphingCalculator(elt);" +
//     "calculator.setExpression({id:'graph1', latex:'y=x^2'});" +
//   '</script>'
//   text = await ply.talk("STUFF")
//   console.log(extras)
//   res.send({audio: text , text: extras})
// }

module.exports = {
  fulfill: fulfill,
}
