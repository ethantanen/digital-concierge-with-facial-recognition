/*
 * createCollection, deleteCollection, indexFaces, listCollections,
 * searchFaces, searchFacesByImage
 */

// Published modules
AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1'
})

// Create Rekognition Service Object
var rk = new AWS.Rekognition({
  apiVersion: '2016-06-27'
})

// Create Collection
function createCollection (collection) {
  var params = {
    CollectionId: collection
  }
  return new Promise((resolve, reject) => {
    rk.createCollection(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Collection
function deleteCollection (collection) {
  var params = {
    CollectionId: collection
  }
  return new Promise((resolve, reject) => {
    rk.deleteCollection(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Index Faces
function indexFaces (collection, bucket, image) {
  var params = {
    CollectionId: collection,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: image
      }
    },
    DetectionAttributes: [
      "ALL",
    ],
  }
  return new Promise((resolve, reject) => {
    rk.indexFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Collection
function listCollections () {
  return new Promise((resolve, reject) => {
    rk.listCollections({}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Search Faces
function searchFaces (collection, faceId) {
  var params = {
    CollectionId: collection,
    FaceId: faceId
  }
  return new Promise((resolve, reject) => {
    rk.searchFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Search Faces By Image
function searchFacesByImage (collection, bucket, image) {
  var params = {
    CollectionId: collection,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: image
      }
    }
  }
  return new Promise((resolve, reject) => {
    rk.searchFacesByImage(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Faces
function deleteFaces(collection, id) {
  var params = {
   CollectionId: collection,
   FaceIds: [
      id,
   ]
  }
  return new Promise((resolve, reject) => {
    rk.deleteFaces(params, function(err, data) {
      if (err) return reject(err)
      return resolve(data)
    })
  })

}

// Expose functions
module.exports = {
  createCollection: createCollection,
  deleteCollection: deleteCollection,
  indexFaces: indexFaces,
  listCollections: listCollections,
  searchFaces: searchFaces,
  searchFacesByImage: searchFacesByImage,
  deleteFaces: deleteFaces,
}
