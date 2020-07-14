// ----------------------------------------------------------------
// This page is used to send the different locations to the server.
// ----------------------------------------------------------------

// Accessing the entire HTML page
const testLocations = document;
// Adding a click event listener to the entire HTML page and passing an event object represented as "e"
testLocations.addEventListener('click', (e) => {
  // Using a switch statement to send the different latitude, longitude and heading values to the server.
  // This is done using the event object property target to get the HTML element that was clicked which is based on 
  // the element's ID.
  switch(e.target.id){
  // Checking if the element with the ID 0 was clicked
  case '0':
    SendData(51.474813,-0.034698,240);
    break;
  // Checking if the element with the ID 1 was clicked
  case '1':
    SendData(51.4749287,-0.0349446,300);
    break;
  // Checking if the element with the ID 2 was clicked
  case '2':
    SendData(51.4740417,-0.0382144,150);
    break;
  // Checking if the element with the ID 3 was clicked
  case '3':
    SendData(51.4767684,-0.0371734,60);
    break;
  // Checking if the element with the ID 4 was clicked
  case '4':
    SendData(51.4755538,-0.0362366,100);
    break 
  // Checking if the element with the ID 5 was clicked
  case '5':
    SendData(51.4807462,0.0930035,100);
    break;
   // Checking if the element with the ID 6 was clicked
  case '6':
    SendData(51.5149005,-0.1443599,40);
    break;
   // Checking if the element with the ID 7 was clicked
  case '7':
    SendData(51.5086645,-0.0942213,280);
    break;
  // Checking if the element with the ID 8 was clicked
  case '8':
    SendData(51.4679526,0.0077821,300);
    break;
   // Checking if the element with the ID 9 was clicked
  case '9':
    SendData(51.499118,0.0056923,330);
    break;
   // Checking if the element with the ID 10 was clicked
  case '10':
    SendData(51.1848725,0.2973628,0);
    break;
  }
  // Calling the loading screen function
  loadingScreen();
})

// Same constructor function for sending location data to the server as the one in file GetLocation.js
function SendData(lat,long,head) {
  this.lat = lat;
  this.long = long;
  this.head = head;

  const data = { latitude: lat, longitude: long, heading: head};

  fetch('/location', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    const value = JSON.parse(data.received)
    const host = window.location.hostname;
    const url = `https://${host}:5000/location`;
    if(value == true){window.location.replace(url);}
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}