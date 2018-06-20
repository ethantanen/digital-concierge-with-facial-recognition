/*
createBucket, deleteBucket, listBucket, putObject,
getObject, deleteObject, listObjects
*/

// TODO: add tagging to putObject

const AWS = require('aws-sdk')
const fs = require('fs')

AWS.config.update({
  region: 'us-east-1'
})

// Create S3 Service Object
var s3 = new AWS.S3({
  apiVersion: '2012-10-17'
})

// Create Bucket
function createBucket (bucket) {
  var params = {
    Bucket: bucket
  }
  return new Promise((resolve, reject) => {
    s3.createBucket(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Bucket
function deleteBucket (bucket) {
  var params = {
    Bucket: bucket
  }
  return new Promise((resolve, reject) => {
    s3.deleteBucket(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Bucket
function listBuckets () {
  return new Promise((resolve, reject) => {
    s3.listBuckets({}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Put Object
function putObject (body, bucket, key) {
  params = {
    Body: body,
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Get Object
function getObject (bucket, key) {
  params = {
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Object
function deleteObject (bucket, key) {
  params = {
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Objects
function listObjects (bucket) {
  params = {
    Bucket: bucket
  }
  return new Promise((resolve, reject) => {
    s3.listObjects(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

module.exports = {
  createBucket: createBucket,
  deleteBucket: deleteBucket,
  listBuckets: listBuckets,
  putObject: putObject,
  getObject: getObject,
  deleteObject: deleteObject,
  listObjects: listObjects
}
