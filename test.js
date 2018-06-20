rk = require('./rekognitionController')
s3 = require('./s3Controller')
fs = require('fs')

const BUCKET_NAME = 'testthatish'
const COLLECTION_NAME = 'collectthatish'

// rk.createCollection(COLLECTION_NAME)
rk.searchFacesByImage(COLLECTION_NAME, BUCKET_NAME, 'one.jpg')
  .then((data) => {
    console.log(JSON.stringify(data, null, '\t'))
  })
