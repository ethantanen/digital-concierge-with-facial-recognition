// Custom modules
const rk = require('./utilities/rekognitionUtilities')
const ddb = require('./utilities/dynamoDBUtilities')

// Object sent to the conversation controller 
function returnObject(isUser,id){
  return {isUser:isUser, id:id}
}

// Determines if the img is a user by id
function isUserById (collection, bucket, image) {
  return new Promise((resolve, reject) => {
      /*
      // Current add new user function TODO: change this in the next iteration
      rk.indexFaces(collection, bucket, image)
        .then((data) => {
          console.log("DID THE DIRTY")
        })
        */
      console.log("searching faces for match...")
      rk.searchFacesByImage(collection,bucket,image)
        .then((res) => {

          // May need to cycle through all faces, not just take largest one
          if(res.FaceMatches.length > 0){
            console.log("found face with " + res.FaceMatches[0].Similarity + " percent similarity...")
            id = res.FaceMatches[0].Face.FaceId
            return resolve(returnObject(true,id))
          }else{
            console.log("face not found...")
            return resolve(returnObject(false,null))
          }
        })
        .catch((err) => {
          reject(err)
        })
  })
}

module.exports = {
  isUserById: isUserById,
}
