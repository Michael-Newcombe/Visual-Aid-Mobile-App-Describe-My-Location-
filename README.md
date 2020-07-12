# Michael-Newcombe-Visual-Aid-Mobile-App-Describe-My-Location-

## A Mobile Web App For The Blind And Visually Impaired

### Overview

Describe My Location is designed to aid people who are blind and visually impaired when they walking along a street, by describing their physical surroundings using a computer vision and machine learning technique called image captioning. This is where a computer tries to describe an image in a natural language. The difference between this app and other visual aid apps that make use of image captioning is that Describe My Location does not require the user to take a picture of their surroundings using their device's camera instead, it uses a street view image based on the user's current geographical location as a reference for the user's surroundings. The street view image is then passed into a pre-trained image captioning model which generates a text description for the image. The text description is then passed into a text to speech system so that the text can be outputted to the user as speech.

### Application Components

**The App**

The app is, developed using the Python web framework Flask, the
CSS for the app is developed using SASS and, the client-side interactivity is, developed using vanilla JavaScript. Furthermore, the application also uses a MySQL database which is, used for storing user feedback. 

**Image Captioning**

The app uses by a pre-train machine learning model called DenseCap which is developed in Lua using the framework Torch. DenseCap is used to perform image captioning by generating text descriptions for the different objects it detects within an image. The paper regarding this model can be found, [here](https://cs.stanford.edu/people/karpathy/densecap/). 
 
**Street View Images**

The street view image the app uses as a reference for the user's surroundings is, based on the user's current location this works, by retrieving the device's geolocation coordinates. As well as the user's location, the direction that the user is facing is also retrieved, by accessing the device's orientation properties. This data is, then passed into the API, Bing™ Maps REST Services which is, used to get the street view image for the user's current location. Documentation on this API can be found, [here](https://docs.microsoft.com/en-us/bingmaps/rest-services/).

**Addtional Features**
In case the app is unable to retrieve a street view image, the user can instead upload an image or take a picture of an image using their device's camera. 
