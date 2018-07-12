
const router = require('express').Router()
const ply = require('../utilities/polly')

router.get('/', async (req, res) => {


  switch (req.session.intent) {

    case 'LogOff':
      req.session.destroy()
      stream = await ply.talk('You\'ve been logged off.')
      res.send({audio: stream, text: 'You\'ve been logged off'})
      break

    default: res.end()

  }
})

// Destroy session
router.post('/logoff', async (req, res) => {
  console.log('hello!')
  req.session.destory()
  stream = await ply.talk("hey hey")
  res.send({audio: stream})
})


router.all((req, res) => {
  console.log(req.baseUrl)
})


module.exports = {
  router: router,
}
