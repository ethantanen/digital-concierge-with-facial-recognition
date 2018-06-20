// TODO: should table name be constant or should each function have tablename param??? change to use east 2

const AWS = require('aws-sdk')

// Create DynamoDB service object
AWS.config.update({region: 'us-east-1'})
var ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
})

// Tables Name
const TABLE_NAME = 'CALVIN_USERS'

// Create Table
function createTable () {
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
    TableName: TABLE_NAME,
    StreamSpecification: {
      StreamEnabled: false
    }
  }
  ddb.createTable(params, (err, data) => {
    if (err) return console.log('Err:', err)
    return console.log('Table added:', JSON.stringify(data))
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
function putItem (profile) {
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
    TableName: TableName
  }
  ddb.putItem(params, (err, data) => {
    if (err) return reject(err)
    return resolve(data)
  })
}

// Get Item
function getItem (userId) {
  var params = {
    Key: {
      USER_ID: {
        S: userId
      }
    },
    TableName: TableName
  }
  return new Promise((resolve, reject) => {
    ddb.getItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Item
function deleteItem (userId) {
  var params = {
    Key: {
      USER_ID: {
        S: userId
      }
    },
    TableName: 'CALVIN_USERS'
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
  deleteItem: deleteItem,
}
