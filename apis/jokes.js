const request = require('request-promise')

// get a random joke
function getJoke() {

  var options = {
    uri: 'https://icanhazdadjoke.com/',
    headers: {
        'Accept': 'application/json'
    },
  };

  return request.get(options)
    .then((data) => {
      console.log(data)
      return JSON.parse(data).joke
    })
    .catch((err) => {
      return "Sorry no jokes for you... I cant think of one."
    })
}

module.exports = {
  getJoke: getJoke,
}
