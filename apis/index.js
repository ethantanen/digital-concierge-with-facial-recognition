const outlook = require('./outlook')
const maps = require('./maps')
const random = require('./random')

module.exports = {

  
  sendMail: outlook.sendMail,
  getMail: outlook.getMail,
  createMeeting: outlook.createMeeting,
  getTimeDest: maps.getTimeDest,
  getISSLocation: random.getISSLocation,
  getChuckNorrisFact: random.getChuckNorrisFact,
  getRandomNumberFact: random.getRandomNumberFact,
  getRonSwansonQuote: random.getRonSwansonQuote,
  searchWiki: random.searchWiki,
  getTheNews: random.getTheNews,
  getQuoteOfTheDay: random.getQuoteOfTheDay,
  getRecipe: random.getRecipe,
  getJoke: random.getJoke,
  getWeather: random.getWeather,

  // help
  // dict
  // wolfram api
  // national holidary api

}
