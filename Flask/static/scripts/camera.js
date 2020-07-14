// -----------------------------------------------------------------------------------------------------------
// This file is used to take a picture using the device's camera the picture taken is then sent to the server.
// -----------------------------------------------------------------------------------------------------------

// Function for displaying camera error messages, takes a string as an argument
const cameraErrors = (message) => {
  // Creating a "p" tag element
  const p = document.createElement('p');
  // The text to display to the user
  const text = message;
  // Creating a text node for displaying the text
  const pText = document.createTextNode(text);
  // Inserting the text node inside the p tag by appending it as a child node
  p.appendChild(pText);
  // Getting the div class error-messages
  const div = document.querySelector('.error-messages');
  // Inserting the p tag inside the error-messages div by appending it as a child node
  div.appendChild(p);
}

// Checking if the interface mediaDevices exist in the navigator, this interface is used for the browser to gain
// access to the connected media devices. The statement below also checks if getUserMedia is in navigator.
// mediaDevices, this method is used to gain access to the device's camera or microphone.
if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  // Getting the HTML canvas element
  const canvas = document.getElementById('camera-canvas');
  // Setting the canvas context to 2D to render 2D graphics
  const context = canvas.getContext('2d');
  // Getting the video element
  const camera = document.getElementById('camera');
  // Getting the div containing the canvas and video element
  const captureImage = document.getElementById('camera-container');

  // Setting the camera constraints
  const constraints = { 
    // Setting the facingMode to the environment, on mobile or tablet devices this is the back camera
    video: { facingMode: 'environment' }, 
    // Disabling the camera audio
    audio: false 
  };

  // Calling the method getUserMedia and passing in the constraints to access the device's camera
  navigator.mediaDevices.getUserMedia(constraints)
  // This returns a MediaStream interface which contains the video stream from the camera
  .then((videoStream) => {
    // Using the property srcObject to pass the video stream from the camera into the video element to view the video 
    camera.srcObject = videoStream;
  })
  // Catching any errors
  .catch((error)=> {
    // Checking if the user has denied the app access to the camera 
    if(error.name=='NotAllowedError')
      {
        // Calling the cameraErrors function and passing in an error message 
        cameraErrors('Access to your camera is required to use this feature, please refresh the page');
      }
    }
  );

  // Function for downloading an image taken by the camera and sending it to the server in JSON format by converting
  // the image into base64 format
  const downloadImage = () => {
    // Getting the canvas element which contains a snapshot of the video stream
    const canvas = document.getElementById('camera-canvas');
    // Converting the canvas image to base64 format using the method toDataURL, the arguments being passed into this
    // method are specifying the type of data to be a jpeg with the image quality set to 50%
    const image  = canvas.toDataURL('image/jpeg', 0.5).toString();
    // Storing the base64 image data into a object
    const data = {imageData: image};
    // The fetch API code below is the same as the code used in the getLocation.js file except the data is being sent
    // to the URL camera-image
    fetch('/camera-image', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      const value = JSON.parse(data.received);
      const host = window.location.hostname;
      const url = `https://${host}:5000/camera-image`;
      if(value == true){window.location.replace(url);}
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

    // Adding an event listener to the camera container which listens for a click event
    captureImage.addEventListener('click', () => {
    // Setting the canvas width to equal the camera width
    canvas.width = camera.videoWidth;
    // Setting the canvas height to equal the camera width
    canvas.height = camera.videoHeight;
    // Drawing the camera image from the video element onto the canvas element
    context.drawImage(camera, 0, 0);
    // Getting the video element that displays the camera
    const cameraDisplay = document.getElementById('camera');
    //Changing the video element style to none so that only the still image that is drawn onto the canvas is visible
    cameraDisplay.style.display = 'none';
    // Calling the function downloadImage to send the canvas image to the server 
    downloadImage();
    // Calling the loadingScreen function
    loadingScreen();
  });
}

// If navigator.mediaDevices.getUserMedia does not exist then a message is displayed to the user telling them that the
// app was unable to access their camera
else {
  // Calling the cameraErrors function and passing in an error message
  cameraErrors('Unable to access camera, try using the file upload button instead and then select camera');
}
