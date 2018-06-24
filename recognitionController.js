// Custom modules
const rk = require('./rekognitionUtilities')

// Determines if the img is a user by id
function isUserById (collection, bucket, image) {
  // Determine face's id
  return rk.indexFaces(collection, bucket, image)
    .then((faceInfo) => {
      // Users faceprint id
      id = faceInfo.FaceRecords[0].Face.FaceId
      // Search the collection by id for similar faces
      return rk.searchFaces(collection,id)
        .then((res) => {
          return isUser(res)
        })
    })
}

// Determines if the img is a user by img
function isUserByImage (collection, bucket, image) {
  // Serach the collection by image for similar face
  return searchFacesByImage(collection, bucket, image)
    .then((res) => {
      return isUser(res)
    })
}

// Parses AWS api responses to determine if img is of a user
function isUser (res) {
  // Return true if there is a face match
  if (res.FaceMatches[0]) {
    return {isUser:true,  id:res.FaceMatches[0].Face.FaceId}
  } else {
    return {isUser:false, id:res.FaceMatches[0].Face.FaceId}
  }
}
