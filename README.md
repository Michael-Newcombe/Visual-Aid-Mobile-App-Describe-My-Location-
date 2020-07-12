# Michael-Newcombe-Visual-Aid-Mobile-App-Describe-My-Location-

## A Mobile App For The Blind And Visually Impaired

### Overview

Describe My Location is designed to aid people who are blind and visually impaired when they walking along a street, by describing their physical surroundings using a computer vision and machine learning technique called image captioning. This is where a computer tries to describe an image in a natural language. The difference between this app and other visual aid apps that make use of image captioning is that Describe My Location does not require the user to take a picture of their surroundings using their device's camera instead, it uses a street view image based on the user's current geographical location as a reference for the user's surroundings. The street view image is then passed into a pre-trained image captioning model which generates a text description for the image. The text description is then passed into a text to speech system so that the text can be outputted to the user as speech.


### Application Components

**The App**

The application is developed using the Python web framework Flask. The frontend of the app is developed using SASS for the styling and vanilla JavaScript for interactivity. Furthermore, the application also uses a MySQL database which is used to store user feedback. 

**Street View Images**

The street view images that the app uses are from, Bing™ Maps REST Services Application Programming Interface (API). Documentation on this API can be found [here](https://docs.microsoft.com/en-us/bingmaps/rest-services/). The street view image that gets passed into the image captioning model is based on the user's location, this works by retrieving the user’s geolocation as well as the direction the user is facing.

**Image Captioning**

The image captioning is done by a pre-train model called DenseCap which generates text descriptions for the different objects within an image. The paper regarding this model can be found [here](https://cs.stanford.edu/people/karpathy/densecap/).

**Addtional Features**
