const s3 = require("./s3Controller")
const ddb = require("./dynamoDBController")
const rk = require("./rekognitionController")

/*
 * Creates a bucket, collection, and table with
 * the same name.
 */
function setup(name) {
  p1 = s3.createBucket(name)
  p2 = ddb.createTable(name)
  p3 = rk.createCollection(name)

  return Promise.all([p1,p2,p3])
    .then((data) => {
      return data
    })
}

// Get name from command line
name = process.argv[2]
console.log("Setting up using name: %s", name)

// Call setup function and print result 
setup(name)
  .then((data) => {
    console.log(JSON.stringify(data,null,2))
  })
