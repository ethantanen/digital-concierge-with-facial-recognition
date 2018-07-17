/*
* Creates a bucket, collection, and table with
* the same name.
*/

// TODO: should delete old tables, containers, etc...

// Custom modules
const ddb = require('../utilities/dynamoDB')
const rk = require('../utilities/rekognition')


// Shared name
name = process.env.NAME

console.log('Setting up Calvin using name: %s', name)
setupSystem()
/*
 * Create necessary storage containers
 */
<<<<<<< HEAD:config/setup.js
function setupSystem() {

  // create table to store users information
  p1 = ddb.createTable(name,"USER_ID")
=======
function setupSystem () {
  // bucket for which put operation triggers lambda
  p1 = s3.createBucket(name)

  // create table to store users information
  p2 = ddb.createTable(name, 'USER_ID')
>>>>>>> eef4620fe9796d4716d4296c2c93a3f4f347a0f2:backend/other/setup.js

  // create collection for indexed faces
  p2 = rk.createCollection(name)

  // Wait until everythings setup before confirming Success or Failure
  Promise.all([p1, p2])
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log("Couldn't build system. Name may be taken.", err)
    })
}
<<<<<<< HEAD:config/setup.js
=======

// TODO: may want to setup conversations here with some function??
>>>>>>> eef4620fe9796d4716d4296c2c93a3f4f347a0f2:backend/other/setup.js
