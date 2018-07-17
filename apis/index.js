const weather = require('./weather')
const jokes = require('./jokes')


module.exports = {
  getWeather: weather.getWeather,
  getJoke: jokes.getJoke,
}
