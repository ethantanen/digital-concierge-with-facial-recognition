// Custom modules
const rk = require('./utilities/rekognitionUtilities')
const ddb = require('./utilities/dynamoDBUtilities')


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
      recog = rk.searchFacesByImage(collection,bucket,image)
        .then((res) => {
          // May need to cycle through all faces, not just take largest one
          if(res.FaceMatches.length > 0){
            console.log("found face with " + res.FaceMatches[0].Similarity + " percent similarity...")
            id = res.FaceMatches[0].Face.FaceId
            return {isUser:true,id:id}
          }else{
            console.log("face not found...")
            return {isUser:false,id:null}
          }
        })
        .catch((err) => {
          reject(err)
        })

      console.log("detecting facial features...")
      face = rk.detectFaces(bucket, image)
        .then((res) => {
          console.log("facial feature detection successful...")
          return {face: res}
        })
        .catch((err) => {
          console.log("unable to detect facial features...")
          reject(err)
        })

      return Promise.all([recog,face])
        .then((data) => {
          return resolve({...data[0],...data[1]})
        })
        .catch((err) => {
          reject(err)
        })
  })
}

module.exports = {
  isUserById: isUserById,
}
