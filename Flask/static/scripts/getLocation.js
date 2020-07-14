//------------------------------------------------------------------------------------------------------
// This file is used to send the user's geolocation to the server as well as the direction that the user
// is facing if the device orientation API is available. 
//------------------------------------------------------------------------------------------------------

// Function for sending the user's geolocation only
const locationOnly = () => {
  // Getting the overlay text element to change the loading screen message
  const overlayText = document.getElementById('overlay-p');
  // Checking if the HTML5 geolocation API exists 
  if (navigator.geolocation) {
    // Changing the loading screen message to tell the user that the generated caption will only be based on their
    // geolocation and not the direction they are facing
    overlayText.innerHTML = 'Processing Image...<br><br> This device does not support compass functionality, the image will be taken without taking into account the direction you are facing. Instead, the compass direction will be fixed to &deg;N';
    // Getting the users current position and storing it into a function with the argument position which contains the
    // geolocation coordinates
    navigator.geolocation.getCurrentPosition((position) => {
      // Accessing the latitude coordinates 
      const lat = position.coords.latitude;
      // Accessing the longitude coordinates 
      const long = position.coords.longitude;
      // Calling the constructor function SendData and passing in the latitude, longitude coordinates and a heading
      // value of 0
      new SendData(lat,long,0);
    },
    // Function for geolocation errors
    function(error) {
      // Checking if the user has denied the app access to their location, if this is true then the message below is
      // shown 
      if (error.code == error.PERMISSION_DENIED)
        {
          overlayText.innerHTML = 'Access to your location is required to use this feature';
        }
    });
  }
  // If the browser does not support geolocation the message below in shown
  else { 
    overlayText.innerHTML = 'This feature requires a browser which supports geolocation';
  }
}

// Function for sending the user's geolocation as well as the direction they are facing
const locationAndDirection = () => {
  //Getting the overlay text element to change the loading screen message
  const overlayText = document.getElementById('overlay-p');
  // Creating an deviceorientation event listener function with the argument event which contains the
  // deviceorientation properties
  window.addEventListener('deviceorientation', (event) => {
    // Checking if the webkitCompassHeading property exists using the operator typeof to check that the returned value
    // is not undefined
    if (typeof event.webkitCompassHeading !== 'undefined') {
      // Checking if the HTML5 geolocation API exists 
      if (navigator.geolocation) {
        // Getting the users current position and storing it into a function with the argument position which contains
        // the geolocation coordinates
         navigator.geolocation.getCurrentPosition((position) => { 
          // Checking the deviceorientation event property webkitCompassHeading does not equal 0, this is to prevent
          // the geolocation coordinates being sent before the webkitCompassHeading property has fired 
          if(event.webkitCompassHeading !== 0){
            // Accessing the latitude coordinates 
            const lat = position.coords.latitude;
            // Accessing the latitude coordinates 
            const long = position.coords.longitude;
            // Accessing the heading value from deviceorientation event property webkitCompassHeading
            const head = event.webkitCompassHeading;
            // Calling the constructor SendData and passing in the latitude, longitude coordinates and the heading value
            new SendData(lat,long,head);
          }
        },
        // Function for geolocation errors
        function(error) {
          // Checking if the user has denied the app access to their location, if this is true then the message below
          // is shown 
          if (error.code == error.PERMISSION_DENIED)
          {
            overlayText.innerHTML = 'Access to your location is required to use this feature, please refresh the page';
          }
        });        
      }
        // If the browser does not support geolocation the message below in shown
      else { 
        overlayText.innerHTML = 'This feature requires a browser which supports geolocation';
      } 
    }
    // If the webkitCompassHeading property does not exist then the locationOnly function is called instead
    else {
      locationOnly();
    }
  });
}

// Function for checking the device orientation event permissions and if the device orientation API exists
const checkPermissions = () => {
  // Getting the overlay text element to change the loading screen message
  const overlayText = document.getElementById('overlay-p');
  // Checking if the device orientation API exists using the operator typeof to check that the returned value does not
  // equal undefined
  if (typeof window.orientation !== 'undefined') {
    // Checking that the DeviceOrientationEvent.requestPermission method exists by checking that the value and type
    // equal a function. This function exists in iOS 13+ devices as they require the user to give permission for the
    // browser to access the device's orientation properties.   
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Calling the method requestPermission
      DeviceOrientationEvent.requestPermission()
      // Using the method then to return the permissionState which is either granted or denied
      .then((permissionState) => {
        // Checking that the permissionState state equals granted this means that the user has given the browser
        // access to the device's orientation properties
        if (permissionState == 'granted') {
          // Calling the locationAndDirection function 
          locationAndDirection();
        }
        // If the user has denied the browser access to the device's orientation properties, the message below is
        // shown        
        else {
          overlayText.innerHTML = 'Please enable device orientation, you can do this by closing this page and restarting your browser';
        }
      });
    }
    // If DeviceOrientationEvent.requestPermission method does not exist then the function locationAndDirection is ran
    // straight away. This is for devices which are non iOS 13+.
    else {
      locationAndDirection();
    }
  }
  // If the device orientation API does not exist, the function locationOnly is called
  else{
    locationOnly();
  }
}

// Constructor function for sending the geolocation coordinates and heading position to the server it takes the users
// longitude, longitude and heading values as it's arguments
function SendData(lat,long,head){
  // Retrieving the latitude value passed into this constructor
  this.lat = lat;
  // Retrieving the longitude value passed into this constructor
  this.long = long;
  // Retrieving the heading value passed into this constructor
  this.head = head;
  // Storing the latitude, longitude, and heading values in a JavaScript object
  const data = { latitude: lat, longitude: long, heading: head};
  // Using the fetch API to send the data to the server in JSON format
  // Specifying the URL to the send the data to  
  fetch('/location', {
    // Setting the HTTP method to POST
    method: 'POST',
    // Specifying the HTTP header content type to JSON
    headers: {
    'Content-Type': 'application/json',
    },
    // Sending the data object to the server in JSON format using the function JSON.stringify   
    body: JSON.stringify(data),
  })
  // Using the method then to return the response from the server in JSON format
  .then(response => response.json())
  // Accessing the response  
  .then(data => {
    // Converting the JSON response to a JavaScript object and accessing the value
    const value = JSON.parse(data.received);
    // Getting the domain name of the web host
    const host = window.location.hostname;
    // Creating a URL link to the location page
    const url = `https://${host}:5000/location`;
    // If the value from the response object equals true then the current page is replaced with the URL above
    if(value == true){window.location.replace(url);}
  })
  // Catching any errors and printing them to the console, currently no errors have been thrown for this built
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Function for displaying the loading screen
const loadingScreen = () => {
  // Getting the loading screen element
  const overlay = document.getElementById('overlay');
  // Changing the style of the loading screen to block to display the loading screen as it is hidden by default
  overlay.style.display = 'block';
}

// Getting the location button element
const getLocation = document.getElementById('location-icon');
// Adding an event listener to the location button which listens for a click event
getLocation.addEventListener('click',() => {
  // Calling the checkPermissions function
  checkPermissions();
  // Calling the loadingScreen function
  loadingScreen();
});

