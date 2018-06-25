// Custom modules
const rk = require('./utilities/rekognitionUtilities')
const ddb = require('./utilities/dynamoDBUtilities')

// Determines if the img is a user by id
function isUserById (collection, bucket, image) {
  console.log("\nIndexing face...")
  // Determine face's id
  return rk.indexFaces(collection, bucket, image)
    .then((faceInfo) => {
      // img faceprint id
      inputImgId = faceInfo.FaceRecords[0].Face.FaceId
      // Check table and collection if img is user
      return isUser(collection,inputImgId)
        .then((res) => {
          res.photoMeta = faceInfo
          return res
        })
    })
}

/*
 * Check collection and table to see if
 * and entry exists for this id
*/
function isUser(collection, id) {
  console.log("Checking if faceprint is in collection...")
  return new Promise((resolve, reject) => {
    return rk.searchFaces(collection, id)
      .then((res) => {
        if(res.FaceMatches[0]) {
          /*
           * Extract the id from the largest similar face
           * in the collection and check if the entry exists
           * in the table.
           */
          console.log("Faceprint is in collection...")
          _id = res.FaceMatches[0].Face.FaceId
          ret = checkTable(_id,collection)
          return resolve(ret)
        } else {
          console.log("Faceprint is not in collection and the image is not of a user...")
          res = {isUser:false, id:id}
          return resolve(res)
        }
      })
  })
}

/*
 * Check if there's an entry in the table for the specified id
 */
function checkTable(id,tableName) {
  console.log("Checking user table to see if the image is of a recognized user...")
  return ddb.getItem(tableName,id)
    .then((res) => {
      //The user exists if the res object has some amount of content
      if(Object.keys(res).length != 0) {
        console.log("User is in table...")
        return {isUser:true,id:id}
      } else {
        console.log("User is not in table...")
        return {isUser:false, id:id}
      }
    })
}

module.exports = {
  isUserById: isUserById,
}
