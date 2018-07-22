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

// get a saucy recipe
async function getRecipe(req, res, next) {
  json = await apis.getRecipe(req.session.slots.foodDish)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// get a random new article
async function getTheNews(req, res, next) {
  json = await apis.getTheNews()
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: "<a href='" + json.extras + "'> Visit Article </a>"})
}

// query wikipedia
async function getRestaurantInfo(req, res, next) {
  json = await apis.searchWiki(req.session.slots.searchTopic)
  send(req, res, next, json.text)
}

// get the defintion of a word
async function getDefinition(req, res, next) {
  word = req.session.slots.WORD
  json = await apis.getDefinition(word)
  stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

async function getRestaurantInfo(req, res, next) {
  json = await apis.getRestaurantInfo()
  text = "<script>"
  text += "$('#thingToAppend').append($(\""+json.extras+"\"));"
  text += "</script>"

  res.send({audio: undefined, text: text})
}

module.exports = {
  getTimeToDest: getTimeToDest,
  getRestaurantInfo: getRestaurantInfo,
  getTheNews: getTheNews,
  getRecipe: getRecipe,
  getTheNews: getTheNews,
  getWeather: getWeather,

}
