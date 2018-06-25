// Custom modules
const rk = require('./utilities/rekognitionUtilities')
const ddb = require(''./utilities/dynamoDBUtilities')

// Determines if the img is a user by id
function isUserById (collection, bucket, image) {
  // Determine face's id
  return rk.indexFaces(collection, bucket, image)
    .then((faceInfo) => {
      // img faceprint id
      inputImgId = faceInfo.FaceRecords[0].Face.FaceId
      // Check table and collection if img is user
      return isUser(collection,inputImgId)
    })
}

/*
 * Check collection and table to see if
 * and entry exists for this id
*/
function isUser(collection, id)
  return new Promise((resolve, reject) => {
    return rk.searchFaces(collection, id)
      .then((res) => {
        if(res.FaceMatches[0]) {
          /*
           * Extract the id from the largest similar face
           * in the collection and check if the entry exists
           * in the table.
           */
          _id = res.FaceMatches[0].Face.FaceId
          return checkTable(_id,collection)
        } else {
          return {isUser:false, id:id}
        }
      })
  })
})

/*
 * Check if there's an entry in the table for the specified id
 */
function checkTable(id,tableName) {
  return ddb.getItem(tableName,id)
    .then((res) => {
      //The user exists if the res object has some amount of content
      if(Object.keys(res).length != 0) {
        return {isUser:true,id:id}
      } else {
        return {isUser:false, id:id}
      }
    })
}

module.exports = {
  isUserById: isUserById,
}
