// -----------------------------------------------------------------------
// This file is used to change the page to the file upload or camera page.
//------------------------------------------------------------------------

// Getting the file upload button
const fileButton = document.getElementById('file-icon');
// Adding an event listener to the file upload button which listens for a click event
fileButton.addEventListener('click', () => {
  // Getting the domain name of the web host
  const host = window.location.hostname;
  // Creating a URL link to the upload file page
  const url = `https://${host}:5000/upload-file`;
  // Replacing the current page with the URL above
  window.location.replace(url);
});

// Getting the camera button
const cameraButton = document.getElementById('camera-icon');
// Adding an event listener to the camera button which listens for a click event
cameraButton.addEventListener('click', () => {
  // Getting the domain name of the web host
  const host = window.location.hostname;
  // Creating a URL link to the camera page
  const url = `https://${host}:5000/camera`;
  // Replacing the current page with the URL above
  window.location.replace(url);
});