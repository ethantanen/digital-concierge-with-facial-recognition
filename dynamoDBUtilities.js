/*
 * createTable, listTables, describeTable, deleteTable, putItem,
 * getItem, deleteItem
 */

 // Publishes modules 
const AWS = require('aws-sdk')

// Create DynamoDB service object
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
})

// Create Table
function createTable (tableName) {
  var params = {
    AttributeDefinitions: [
      {
        AttributeName: 'USER_ID',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'USER_ID',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableName: tableName,
    StreamSpecification: {
      StreamEnabled: false
    }
  }
  return new Promise((resolve, reject) => {
    ddb.createTable(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Tables
function listTables () {
  return new Promise((resolve, reject) => {
    ddb.listTables({Limit: 10}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Describe Table
function describeTable (tableName) {
  var params = {
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    ddb.describeTable(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data.Table.KeySchema)
    })
  })
}

// Delete Table
function deleteTable (tableName) {
  var params = {
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    ddb.deleteTable(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Put Item
// TODO: add key to item's object for each new feature
function putItem (tableName, profile) {
  var params = {
    Item: {
      'USER_ID': {
        S: profile.USER_ID
      },
      'USER_NAME': {
        S: profile.USER_NAME
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    ddb.putItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Get Item
function getItem (tableName, userId) {
  var params = {
    Key: {
      USER_ID: {
        S: userId
      }
    },
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    ddb.getItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Item
function deleteItem (tableName, userId) {
  var params = {
    Key: {
      USER_ID: {
        S: userId
      }
    },
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    ddb.deleteItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Query
function query () {

}

module.exports = {
  createTable: createTable,
  listTables: listTables,
  describeTable: describeTable,
  deleteTable: deleteTable,
  putItem: putItem,
  getItem: getItem,
  deleteItem: deleteItem
}
