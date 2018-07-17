/*
 * This controller provides the functionality to add a user to
 * Calvin's system.
 */

// Custom modules
const rk = require('./utilities/rekognitionUtilities')
const ddb = require('./utilities/dynamoDBUtilities')

/*
 * This function adds a user to the system, which entails
 * adding the user to the face collection and dynamo database.
 * The meta paramter contains information to store on the user
 * such as job title.
 */
function addUser (collection, bucket, image, meta) {
  // index the face in the provided image
  return rk.indexFaces(collection, bucket, image)
    .then((data) => {
      // concatenate the face id with the metadata
      var id = res.FaceMatches[0].Face.FaceId
      var userData = {...{USER_ID: id}, ...meta}

      // add the user to the database
      ddb.putItem(collection, userData)
        .then(() => {
          return userData
        })
        .catch((err) => {
          return {error: 'couldn\'t add user to database'}
        })
    })
    .catch((err) => {
      return {error: 'no face in image'}
    })
}

module.exports = {
  addUser: addUser
}
