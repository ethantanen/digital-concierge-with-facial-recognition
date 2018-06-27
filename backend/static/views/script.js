$(document).ready( () => {

// EC2 server
const URL = "/testing"
//"http://ec2-54-242-44-197.compute-1.amazonaws.com:3000/image"

// Executes when form submit occurs
$("#submit").click(() => {

  // Grab file from DOM
  selectedFile = document.getElementById('file').files[0];
  console.log("received file...")

  // Convert to base-64
  convertTo64(selectedFile)
    .then((base64) => {
      // Post img to Calvin
      post(base64)
    })
    .catch((err) => {
      console.log("err: ", err)
    })
})

// Use ajax to post image to calvin
function post(img) {
  console.log("posting file...")
  data = {
    image: img,
    key: "ass"
  }
  options = {
    type: "POST",
    url: URL,
    data: data,
    success: success,
    error: error,
  }
  $.ajax(options)
}

// Convert image to base-64 encoding
function convertTo64(file) {
  return new Promise((resolve, reject) => {
    reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("converting file...")
    reader.onload = function () {
      return resolve(reader.result)
    };
    reader.onerror = function (error) {
      return reject(err)
    };
  })
}

// Success function
function success(data,g) {
  console.log("YEAY",data,g)
}

// Error function
function error(err,stuff) {
  console.log("ERR",err,stuff)
}


/*
app.get("/s3", (req, res) => {
  file = fs.readFileSync("/Users/ethantanen/Downloads/gleeshy.jpg")
  // extract filename and file data
  key  = "ass.jpg"
  return s3.putObject(NAME,file,key)
    .then((data) => {
      /*
       * execute recognition only after the image
       * is successfully placed in the Bucket
       *
     determineIsUser(NAME, NAME, key)
        .then((data) => {
          res.send("victory")
        })
    })
    .catch((err) => {
      res.send("error")
    })
})
*/


*
 * WARNING: there may be issues with the value of key if
 * there are multiple requests to this endpoint at the same
 * time due to the putObject promise.
 */
 /*
// Endpoint reached when photo is submitted
app.post("/photo",(req, res) => {
  // parse html form
  form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    // extract filename and file data
    key  = files.file.name
    file = fs.readFileSync(files.file.path)
    // put image into bucket
    s3.putObject64(NAME,file,key)
      .then((data) => {
        /*
         * execute recognition only after the image
         * is successfully placed in the Bucket
         *
         determineIsUser(NAME, NAME, key)
          .then((data) => {
            res.redirect("/")

          })
      })
      .catch((err) => {
        console.log("ERR",err)
      })
  })
})
*/


})
