ddb = require('./dynamoDB')

ddb.scan(process.env.NAME, "EMAIL", 'cc')
  .then((data) => {
    console.log(JSON.stringify(data,null,1))
  })
  .catch((err) => {
    console.log(err)
  })
