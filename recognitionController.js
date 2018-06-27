// Custom modules
const rk = require('./utilities/rekognitionUtilities')
const ddb = require('./utilities/dynamoDBUtilities')

function returnObject(isUser,id){
  return {isUser:isUser, id:id}
}

// Determines if the img is a user by id
function isUserById (collection, bucket, image) {
  return new Promise((resolve, reject) => {
      rk.searchFacesByImage(collection,bucket,image)
        .then((res) => {

          // May need to cycle through all faces, not just take largest one
          if(res.FaceMatches.length > 0){
            console.log(res.FaceMatches[0])
            id = res.FaceMatches[0].Face.FaceId
            return resolve(returnObject(true,id))
          }else{
            return resolve(returnObject(false,null))
          }




        })
        .catch((err) => {
          console.log("EEK")
          reject(err)
        })
  })
}













module.exports = {
  isUserById: isUserById,
}
