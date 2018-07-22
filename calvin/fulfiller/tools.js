const ply = require('../utilities/polly')
const apis = require('../apis/index')
const uuidv1 = require('uuid/v1');

async function fileShare() {
  stream = await ply.talk("")
  html = "<iframe style='width:100%; height:400px' src='https://fast-river-89193.herokuapp.com/'></iframe>"
  sendHTML(req, res, next, 'Here is my file sharing software',html)
}

// render the calculator
function calculator (req, res, next) {

  id = uuidv1();

  text =
  "Calculator: " +
  "<script>" +
  "$('#thingToAppend').append(\"<div id='" + id + "' style='height:450px;width=500px'></div>\");" +
  "var elt = document.getElementById('" + id + "'); " +
  "var calculator = Desmos.GraphingCalculator(elt);" +
  "calculator.setExpression({id:'graph1', latex:'y=x^2'});" +
  "</script>"

  res.send({audio: undefined, text:text})
}

module.exports = {
  fileShare: fileShare,
  calculator: calculator,
}
