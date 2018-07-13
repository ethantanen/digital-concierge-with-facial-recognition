
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

// get weather for a particular city
function fetchWeather(city) {
  const url =  "http://api.openweathermap.org/data/2.5/weather?appid=47639444acd3350e5a67c5b42f6e6495&q=" + city
  request.get(url)
    .then((data) => {
      // convert string to json
      data = JSON.parse(data)

      // grab wanted information
      description = data.weather[0].description
      temp = data.main.temp
      humidity = data.main.humidity
      city = data.name

      // format response
      text = "It is " + temp + " degrees in " + city + " with humidity levels around " + humidity + " percent. There are " + description
      return text
    })
    .catch((err) => {
      return "I couldn't get the weather for the requested city."
    })
}




module.exports = {
    getJoke: getJoke
};
