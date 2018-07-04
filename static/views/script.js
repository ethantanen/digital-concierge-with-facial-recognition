$(document)
  .ready(() => {


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
      })
  })