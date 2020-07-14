//----------------------------------------------------
// This file is used to upload an image to the server.
//----------------------------------------------------

// Function which checks if an image has been uploaded to the form, it then submits the form automatically so that
// there is no need for the user to press a submit button 
const checkForm = () => {
  // Getting the file input element
  const imageForm = document.getElementById('image-file');
  // Checking if the file input element contains a file 
  if ('files' in imageForm){
    // Getting the form element
    const uploadForm = document.getElementById('upload-form');
    // Submitting the form
    uploadForm.submit();
  }
}

// Getting the file input element
const imageFile = document.getElementById('image-file');
// Calling an event listener on the file input element which listens for changes to the element such as a file upload 
imageFile.addEventListener('change', () => {
  // Calling the checkForm function
  checkForm();
  // Calling the loadingScreen function
  loadingScreen();
});