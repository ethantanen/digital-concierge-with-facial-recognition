// Custom modules
const rk = require('./utilities/rekognitionUtilities')

// Determines if the img is a user by an image
function isUser (collection, bucket, image) {
  // get facial features and determine if image is of user
  var features = detectFacialFeatures(bucket, image)
  var recognize = determineIsUserByImage(collection, bucket, image)

  // wait for functions to complete, concatenate objects and return
  return Promise.all([features, recognize])
    .then((data) => {
      return resolve({...data[0], ...data[1]})
    })
    .catch((err) => {
      return reject({error: 'no face in image'})
    })
}

// Determine the facial features of the user in the image
async function detectFacialFeatures (bucket, image) {
  var features = await rk.detectFaces(bucket, image)
  return {face: features}
}

// Determine if the image contains a user
async function determineIsUserByImage (collection, bucket, image) {
  var res = await rk.searchFacesByImage(collection, bucket, image)
  if (res.FaceMatches.length > 0) {
    var id = res.FaceMatches[0].Face.FaceId
    return {isUser: true, id: id}
  } else {
    return {isUser: false, id: null}
  }
}

module.exports = {
  isUser: isUser
}
