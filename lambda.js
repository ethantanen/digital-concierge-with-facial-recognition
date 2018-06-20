const http = require("http")
exports.handler = (event, context, callback) => {
    
    const EC2_URL = 'ec2-54-242-44-197.compute-1.amazonaws.com'
    
    var bucket = event.Records[0].s3.bucket.name
    var object = event.Records[0].s3.object.key
    
    var data = {bucket:bucket,object:object}
    data = JSON.stringify(data)
    
    console.log("DATA:", data)
    
    var options = {
      hostname: EC2_URL,
      port: 3000,
      path: '',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
    }
    
    var req = http.request(options, function(res) {
      console.log('Status: ' + res.statusCode);
      res.setEncoding('utf8');
      res.on('data', function (body) {
        console.log('Body: ' + body);
      });
    })
    
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    
    // write data to request body
    req.write(data);
    req.end();
}
