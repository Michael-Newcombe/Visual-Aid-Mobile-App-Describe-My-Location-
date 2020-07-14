//---------------------------------------------------------------------------------------
// This file is used to insert the captions generated by DenseCap into the feedback form.
//---------------------------------------------------------------------------------------

// Getting the form submit button
const formSubmit = document.getElementById('submit');
// Initialising an empty array for storing the captions
let captionsArray = [];
// Adding an event listener to the form submit button which listens for a click event
formSubmit.addEventListener('click', () => {
  // Getting the span elements which contain the captions
  let getCaptions = document.getElementsByTagName('SPAN');
  // Looping through all of the span elements
  for(let i = 0; i < getCaptions.length; i++) {
    // Storing each caption inside a span element by accessing the innerHTML
    const captions = getCaptions[i].innerHTML;
    // Adding the captions the empty array
    captionsArray.push(captions);
    // Getting the captions input field inside the form and changes it's value to an array containing the caption,
    // then converting the array into a string
    document.getElementById('captions').value = captionsArray.toString();
  }
});