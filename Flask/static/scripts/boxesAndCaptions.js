//-----------------------------------------------------------------------------------------------------
// This file is used to retrieve the captions and bounding boxes from the server. It then displays the captions onto
// the page and draws the bounding boxes onto the image. As well it passes the captions into the speechsynthesis API.
//-----------------------------------------------------------------------------------------------------

// Getting the HTML canvas element
const canvas = document.getElementById('canvas');
// Setting the canvas context to 2D to render 2D graphics
const context = canvas.getContext('2d');
// Getting the captioned image jpeg element
const img = document.getElementById('jpgImage');
// Initialising an empty array
let colourArray = [];

// Executing the code below once the page has loaded all of the content
window.onload = () => {
   // Drawing the image onto the canvas with a position of 0,0 and width and height of 720px which is the 
   // size of the jpeg image 
  context.drawImage(img, 0, 0, 720, 720);
  // Using the fetch API to retrieve the caption data from the server
  // Specifying the URL to get the data from 
  fetch('/results')
    // Retrieving the data using a GET request, this the default HTTP method for the fetch API so it does not need to
    // be specified
    // Returning the data retrieved from the GET request in JSON format
    .then(response => response.json())
    // Passing the JSON data into a function
    .then(function (json) {
      // Converting the JSON data into a JavaScript Object
      const data = JSON.parse(json);
      // Accessing the captions array from the object
      const captions = data.results.captions;
      // Accessing the bounding boxes array from the object
      const boxes = data.results.boxes;
      // Accessing the isStreetView boolean variable from the object
      const isStreetView = data.results.isStreetView;
      // Accessing the isStreet boolean variable from the object
      const isStreet = data.results.isStreet;
      // Converting the captions array into a string
      const captionsString = captions.toString();

      // Checking if the isStreetView variable equals true this means that the image is a Bing Maps street view image
      if(isStreetView == true) {
        // Checking the variable is isStreet equals true this means DenseCap thinks the image is of a city street
        if(isStreet == true) {
          // Calling the constructor function GetText which is used to pass the caption text into the speechSynthesis
          // API located inside the file textToSpeech.js as well as passing the captions a start string sentence is
          // also passed using concatenation. This start string sentence is used specifically for describing city
          // street images.
          new GetText(`Your current surroundings consist of a city street with ${captionsString}`);
        }
        // if isStreet does not equal true then DenseCap does not think the image is of a city street
        else {
          // Passing a different start string into the constructor function GetText
          new GetText(`Your current surroundings consist of ${captionsString}`);
        }
      }
      // If the image is not a Bing Maps street view image
      else {
         // Calling the constructor function GetText and passing in the captions along with a start string sentence
         // using concatenation. This start string sentence is for describing images taken by users camera or for
         // images upload by the user.
        new GetText(`This image consist of ${captionsString}`);
      }

      // Looping through the length of the captions array
      for(let i = 0; i < captions.length; i++) {
        // Creating an array of random RGB colour values by pushing the function colours into the array colourArray
        colourArray.push(colours());
      }
      
      // Looping through the length of the captions array
      for (let i =0; i < captions.length; i++) {
        // Accessing each element within the captions array
        const text = captions[i];
        // Accessing each element within the colourArray array 
        const textColour = colourArray[i];
        // Creating multiple SetText objects by passing in each element from the two arrays captions and colourArray
        new SetText(text,textColour);
      }

      // Looping through the length of the boxes array
      for (let i=0; i < boxes.length; i++) {
        // This for loop is used to access the x pos, y pos and width and height values of each bounding box, as the
        // bounding boxes are in a 2D array "i" is being used to access the rows within the 2D array followed by a
        // hardcoded index value for accessing the columns which contain the x, y, width and height values

        // Retrieving the x position of each bounding box by accessing the first index within the column
        const xPos = boxes[i][0];
        // Retrieving the y position of each bounding box by accessing the second index within the column
        const yPos = boxes[i][1];
        // Retrieving the width of each bounding box by accessing the third index within the column
        const width = boxes[i][2];
        // Retrieving the height of each bounding box by accessing the fourth index within the column
        const height = boxes[i][3];
        // Accessing each element within the colourArray array 
        const boxColour = colourArray[i];
       // Creating multiple DrawRect objects by passing in the x pos, y pos, width and height of each bounding box, as
       // well as a RGB colour from the colourArray for the box's fill and stroke
        new DrawRect(xPos,yPos,width,height,boxColour);
      }

    })
    // Catching any errors and printing them to the console, currently no errors have been thrown for this built
    .catch((error) => {
      console.error('Error:', error);
    });

}

// Constructor function for drawing a bounding box onto the canvas, it takes an x pos, y pos, width, height and a fill
// and stroke colour as it's arguments
function DrawRect(x,y,width,height,colour) {
  // Retrieving the x pos value passed into this constructor
  this.x = x;
  // Retrieving the y pos value passed into this constructor
  this.y = y;
  // Retrieving the width value passed into this constructor
  this.width = width;
  // Retrieving the height value passed into this constructor
  this.height = height;
  // Retrieving the RGB colour value passed into this constructor
  this.fill = colour;
  // Drawing a bounding box
  // Creating a new path this is needed for each bonding bounding box to be a different colour
  context.beginPath();
  // Setting the bounding box fill colour by concatenating the variable colour into a string which is in RGBA format
  // with an alpha value of 0.3
  context.fillStyle = `rgba(${colour},0.3)`;
  // Applying the fill colour and drawing the bounding box by passing in the x, y, width, and height values into the
  // fillRect method
  context.fillRect(x,y,width,height);
  // Setting the bounding box stroke colour by concatenating the variable colour into a string which is in RGB format
  context.strokeStyle = `rgb(${colour})`;
  // Setting the stroke width of the bounding box 
  context.lineWidth = '4';
  //Applying the stroke
  context.strokeRect(x,y,width,height);
}

// Constructor function for displaying a caption, takes a caption and a colour as its arguments
function SetText(text,colour) {
  // Retrieving the text passed into this constructor
  this.text = text;
  // Retrieving the colour passed into this constructor
  this.colour = colour;
  // Creating a span element for containing each caption
  const span = document.createElement('span');
  // Creating a text node for displaying the caption
  const spanText = document.createTextNode(`${text} `);
  // Inserting the caption into the span element by appending it as a child node
  span.appendChild(spanText);
  // Setting the text colour to the variable colour
  span.style.color = `rgb(${colour})`;
  // Getting the div for containing all of the span elements
  const div = document.getElementById('caption-text');
  // Inserting the span elements to the div by appending it as a child node
  div.appendChild(span);
}

// Function for returning a random RGB colour
const colours = () => {
  // Random red value between 0 and 255 using Math.random(), the value is also being floored using Math.floor() so
  // that only a whole integer is returned 
  const r = Math.floor(Math.random() * 255);
  // Same as above but for the green value
  const g = Math.floor(Math.random() * 255);
  // Same as above but for the blue value
  const b = Math.floor(Math.random() * 255);
  // Checking if the variables r,g,b add up to be greater than or equal to 720, this means that the random colour is a
  // shade of white which means the text will conflict with the background colour of the app, in this case a default
  // RGB colour is returned. If the variables r,g,b don't add up to be greater or equal to 720 then the random RGB
  // colour is returned by concatenating the variables r,g,b into a string.
  return (r + g + b >= 720 ? '138,43,226' : `${r},${g},${b}`);
}






