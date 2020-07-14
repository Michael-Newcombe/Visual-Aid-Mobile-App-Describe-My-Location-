// ------------------------------------------------------------
// This file is used to redirect the user back to the homepage.
// ------------------------------------------------------------

//Function for redirecting the user 
const redirect = () => {
  // Getting the domain name of the web host
  const host = window.location.hostname;
  // Creating a URL link to the index page
  const url = `https://${host}:5000/`;
  // Replacing the current page with the URL above
  window.location.replace(url);
}

// Calling the function above after 3 seconds
setTimeout(redirect, 3000);