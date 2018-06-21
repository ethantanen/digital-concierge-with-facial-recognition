const s3 = require('./s3Controller')
const ddb = require('./dynamoDBController')
const rk = require('./rekognitionController')

/*
 * Creates a bucket, collection, and table with
 * the same name.
 */
function setup (name) {
  console.log('Setting up using name: %s', name)

  p1 = s3.createBucket(name)
  p2 = ddb.createTable(name)
  p3 = rk.createCollection(name)

  return Promise.all([p1, p2, p3])
    .then((data) => {
      console.log(data)
      return data
    })
}

module.exports = {
  setup: setup
}
