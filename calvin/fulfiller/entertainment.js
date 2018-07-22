const ply = require('../utilities/polly')
const apis = require('../apis/index')


async function getLoveCalculator(req, res, next) {
  json = await apis.loveCalculator(req.session.slots.FIRST,req.session.slots.SECOND)
  send(req, res, next, json)
}


module.exports = {
  getLoveCalculator: getLoveCalculator,
}
