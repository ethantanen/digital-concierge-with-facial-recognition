$(document)
 .ready(() => {

   var firstAppend = true;


   // Request access to the camera!
   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
     navigator.mediaDevices.getUserMedia({
         video: true
       })
       .then(function(stream) {
         video.src = window.URL.createObjectURL(stream);
         video.play()
       });
   }

   // Elements for taking and displaying the snapshot
   var canvas = document.getElementById('canvas');
   var context = canvas.getContext('2d');
   var video = document.getElementById('videos');
   var image = document.getElementById('bulldog');

   context.drawImage(image, 0, 0, 400, 300);

   // Trigger take photo
   document.getElementById("snap")
     .addEventListener("click", function() {
       context.drawImage(video, 0, 0, 400, 300)
     });

   // Play speech.mp3 file
   function playAudio(audioStream) {
     var uInt8Array = new Uint8Array(audioStream);
     var arrayBuffer = uInt8Array.buffer;
     var blob = new Blob([arrayBuffer]);
     var url = URL.createObjectURL(blob);
     document.getElementById('audio')
       .src = url;
     document.getElementById('audio')
       .play();
   }

   function sendData(json, url, success) {
     $.ajax({
       type: 'POST',
       url: url,
       data: json,
       dataType: 'json',
       success: (res) => {
         success(res)
       }
     })
   }

   META = null
   SEND_URL = '/authenticate'


   $('#send')
     .click(() => {
       img_64 = document.getElementById('canvas')
         .toDataURL('image/jpeg')
       json = {
         image: img_64
       }

       if (SEND_URL === '/adduser') {
         json = { ...json,
           ...{
             meta: META
           }
         }
         console.log(json)
       }

       sendData(json, SEND_URL, (res) => {
         playAudio(res.audio.data)
         SEND_URL = '/authenticate'
       })
     })

   $('#uploadfile')
     .click(() => {
       img = document.getElementById('file')
         .files[0]
       reader = new FileReader()
       reader.readAsDataURL(img)
       reader.onload = () => {
         sendData({
           image: reader.result
         }, URL, (res) => {
           playAudio(res.audio.data)
         })
       }
     })

     $("#response").keyup(function(event) {
       if (event.keyCode === 13) {
         $("#conversation").click();
       }
      });

   $('#conversation')
     .click(() => {
       console.log("HERE")
       json = {
         text: $('#response')
           .val()
       }
       sendData(json, '/conversation', (res) => {
         if (res.meta) {

           META = res.meta
           SEND_URL = '/adduser'

         }
         playAudio(res.audio.data)

       })
       $('#makeTextBox').trigger("click");
       $("#response").val("");
       const objDiv = document.getElementById('scrollList');
       objDiv.scrollTop = objDiv.scrollHeight;
     })

     $('#makeTextBox')
     .click(() => {

       var typedInfo = $('#response').val();

       if (firstAppend) {
         var fullTitle = $("<div style='display: block'  class='containerChat darkerChat'> <img src='\otherLogo.png' alt='Avatar'  class='rightChat'> <p class='textRight'>" + typedInfo + "</p></div>");
         $('#thingToAppend').append(fullTitle);
         firstAppend = false;
       }
       else {
         var fullTitle = $("<div class='containerChat darkerChat'> <img src='\otherLogo.png' alt='Avatar'  class='rightChat'> <p class='textRight'>" + typedInfo + "</p></div>");
         $('#thingToAppend').append(fullTitle);
       }
     })
 })