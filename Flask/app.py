# --------------------------------------
# Describe My Location
#
# A 3rd Year Creative Computing Project
# Created By Michael Newcombe (2020)
# --------------------------------------

# Importing Flask along with the following Flask modules:
# "request" for handling HTTP requests in Flask
# "render_template" for displaying HTML pages in Flask
# "redirect" for redirecting the user to another route
# "url_for" for generating URLs
# "flash" for displaying messages from the server to the client
# "jsonify" for handling JSON data 
from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
# Importing secure_filename which is used to for safely storing files on a file system 
from werkzeug.utils import secure_filename
# Importing my functions for filtering the DenseCap captions
from captions_filter import filteredCaptions, filteredstreetViewCaptions
# Importing my class called DBConnect which is used to connect to the database
from db_connect import DBConnect
# Importing my feedback from
from form import submitFeedback
# Importing the following python modules:
# "subprocess" for executing shell commands using python
# "json" for handling JSON data
# "os" for interacting with the operating system using python
# "tempfile" for creating temporary files
# "requests" for handling requests HTTP in python
# "base64" for encoding or decoding binary data
# "re" regular expressions to search for patterns in a string
import subprocess, json, os, tempfile, requests, base64, re

# Global variables
# Variable which contains the path to the image upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static/images')
# Python set which contains the image file extensions that the user is allowed to upload
ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}

# Global mutables
# Mutable dictionary for checking which directory the application is in, initially set to flask
_directory_state = {'directory': 'flask'}
# Mutable dictionary for storing the users latitude, longitude and heading data
_loc = {'lat': 0, 'long': 0, 'head': 0}
# Mutable dictionary for storing the camera image filename
_camera_img = {'filename': ''}
# Mutable dictionary for checking if the image is a street view image from Bing Maps, initially set to false
_street_view = {'streetView': False}

connect_to_db = False

# Creating a instance of Flask
app = Flask(__name__)
# Specifying the file upload directory using the Flask config method
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Creating a 24 character secret key using the os.urandom method, this is required when submitting a form using a 
# csrf token
app.secret_key = os.urandom(24)

# Creating a instance of the class DBConnect 
if connect_to_db == True:
	db = DBConnect()

# Defining a function for the file types that the user is allowed to upload to server, which takes the 
# uploaded file as an argument
def allowedFile(filename):
	# Returning files that contain a . in their name, retrieving the extension by splitting the extension and 
	# filename, then checking if the extension is in the ALLOWED_EXTENSIONS set
	return '.' in filename and \
	filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS 

# Home page
@app.route('/')
def index():
	# Displaying the home page
	return render_template('index.html')

""" Image upload page excepts the HTTP methods GET and POST, this page allows users to upload images from there device
to the server through an HTML form using the HTTP request POST. The uploaded image filename is then passed to the
route which runs the DenseCap model """
@app.route('/upload-file', methods=['GET', 'POST'])
def upload_file():
	# Checking if the image form has been submitted by checking if a POST request has been made  
	if request.method == 'POST':
		# Accessing the uploaded data from the form by passing the key "file" into the request.files 
		# dictionary 
		file = request.files['file']
		# Checking that the uploaded file data is not empty and that the file is a jpeg
		if file and allowedFile(file.filename):
			# Setting the street view value to false as this is not a Bing Maps street view image
			_street_view['streetView'] = False
			# Using tempfile to generate a temporary file for the image in the UPLOAD_FOLDER directory
			# the filename can then be accessed through the second index
			file.filename = tempfile.mkstemp(suffix='.jpg', dir=UPLOAD_FOLDER)
			# Using the function secure_filename to make sure that the uploaded file is not malicious code
			filename = secure_filename(os.path.basename(file.filename[1]))
			# Saving the image in the upload folder directory
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			# Redirecting to the route which runs DenseCap and passing the image filename into the URL
			return redirect(url_for('run_model', filename=filename))
		else:
			# Display message for the user if they upload a file which isn't a jpeg
			flash('Please upload a JPEG image')
			# Redirecting the user to the current page to clear the form data
			return redirect(request.url)
	# Displaying the upload image page
	return render_template('upload_file.html')

# Camera page
@app.route('/camera')
def camera():
	# Rendering the camera page
	return render_template('camera.html')

""" Route for processing the camera image, it excepts the HTTP methods GET and POST. This route works by receiving the
image taken by the user's camera which gets send in base64 format through a POST request. The image is then decoded
and saved as a JPEG. Once the image has been saved a message is sent back to the client, which triggers the client to
make a GET request to this route. Once a GET request has been made to this route the image filename is passed to the
route which runs the DenseCap model """
@app.route('/camera-image', methods=['GET', 'POST'])
def camera_image():
	# Checking if the request method is POST, this means that the JSON image data has been sent via the Fetch API
	if request.method == 'POST':
		# Setting the street view value to false as this is not a Bing Maps street view image
		_street_view['streetView'] = False
		print('Incoming image data...')
		# Printing the JSON data to the console
		print(request.get_json())
    # Storing the JSON data
		json_data = request.get_json()
		# Accessing the image data inside the JSON file
		image_data = json_data['imageData']
		# Using regular expression to search for the beginning code that appears in a base64URL and removing it
		# so that we are just left with the base64 data
		base64_data = re.sub('^data:image/.+;base64,', '', image_data)
		# Decoding the base64 data to an image
		base64_to_image = base64.b64decode(base64_data)
		# Generating a temporary file for the image in the UPLOAD_FOLDER directory
		image_file_path = tempfile.mkstemp(suffix='.jpeg', dir=UPLOAD_FOLDER)
		# Changing the dictionary key value which stores the camera image filename to the temporary file name
		_camera_img['filename'] = os.path.basename(image_file_path[1])
		# Opening the temporary file and overwriting it with write binary permissions
		with open(os.path.join(UPLOAD_FOLDER, _camera_img['filename']), 'wb') as f:
			print('Image successfully Saved: ', _camera_img['filename'])
			# Writing the camera image into the temporary file
			f.write(base64_to_image)
			# Sending a JSON message back to the client with the value true to say that the image has been has been successfully 
			# saved, this then triggers a GET request to this route
			return jsonify ({'received': True})
			# Checking if a GET request has been route to the route
	else:
		# Redirecting to the route which runs DenseCap and passing the camera image filename into the URL 
		return redirect(url_for('run_model', filename=_camera_img['filename']))

# Page which contains test locations
@app.route('/test-locations')
def test_locations():
	# Displaying the test locations page
	return render_template('test_locations.html')

""" Location route excepts the HTTP methods GET and POST, this route is used to retrieve the user's geolocation and
heading information. The route works by storing the users latitude, longitude and heading data which gets sent from
the client in JSON format through a POST request, once this data has been stored a message is sent back to the client
which triggers the client to make a GET request to this route. Once a GET request to this route has been made the
latitude, longitude and heading values are passed into the route which downloads a Bing Maps street view image. """
@app.route('/location', methods=['GET', 'POST'])
def get_location():
	# Checking if the request method is POST, this means that the JSON geolocation and heading data has been sent via the Fetch API
	if request.method == 'POST':
		print('Incoming location data...')
		# Printing the JSON data to the console
		print(request.get_json())
		# Storing the JSON data
		json_location = request.get_json()
		# Storing the latitude value from the jSON data to the key lat inside the dictionary _loc
		_loc['lat'] = json_location['latitude']
		# Storing the longitude value from the jSON data to the key long inside the dictionary _loc
		_loc['long'] = json_location['longitude']
		# Storing the heading value from the jSON data to the key head inside the dictionary _loc
		_loc['head'] = json_location['heading']
		# Sending a JSON message back to the client with the value true to say that the data has been received, this then triggers a 
		# get request to this route
		return jsonify ({'received': True})
		# Checking if a GET request has been made 
	else:
		# Redirecting to the route which downloads a Bing Maps street view image and passing in the
		# variables latitude, longitude and heading into the route's URL
		return redirect(url_for('download_image', latitude=_loc['lat'], longitude=_loc['long'], heading=_loc['head']))

""" Route for downloading a street view image from Bing Maps. This route works by passing the variables, latitude, longitude and heading into the URL, these variables can then be accessed by passing them into the download_image function. The latitude, longitude and heading variables are then passed in the Bing Maps REST API which returns a static street view image based on the coordinates that are passed in. The function then downloads the image and passes the filename to the route which runs the DenseCap model. """ 
# Passing the latitude, longitude and heading values as URL parameters
@app.route('/download-image/<latitude>/<longitude>/<heading>')
# Accessing the latitude, longitude and heading values from the URL parameters
def download_image(latitude, longitude, heading):
	# Passing the latitude, longitude and heading values into the Bing Maps REST API URL 
	image_url = 'https://dev.virtualearth.net/REST/V1/Imagery/Map/Streetside/{latitude},{longitude}/0?heading={heading}&pitch=0&key=AmK5btu3DRH210uZXr8wBGuBQHHOxpuq22qRBtcuwY30jeHy0z69KTiHVTKMz5VN'.format(latitude=latitude, longitude=longitude, heading=heading)
	# Generating a temporary file location for the street view image in the UPLOAD_FOLDER directory
	temp_file_path = tempfile.mkstemp(suffix='.jpg', dir=UPLOAD_FOLDER)
	# Accessing the name of the file created by tempfile.mkstemp()
	filename = os.path.basename(temp_file_path[1])
	# Using requests to download the static street view image with stream set to true, this means that the content will
	# not be downloaded until the response.content attribute has been accessed	
	r = requests.get(image_url, stream=True)
	# Checking if the request was successful
	if r.status_code == 200:
	  # Setting the streetView value to true as this image is a Bing Maps street view image
		_street_view['streetView'] = True
		# Decoding the raw data to return an image
		r.raw.decode_content = True
		# Opening the temporary file and overwriting it with write binary permissions
		with open(os.path.join(UPLOAD_FOLDER, filename), 'wb') as f:
			# Writing the street view image into the temporary file
			f.write(r.content)
		print('Image successfully Downloaded: ', filename)
		# Redirecting to the route which runs DenseCap and passing the image filename into the URL 
		return redirect(url_for('run_model', filename=filename))
		# Checking if the image Couldn't be downloaded
	else:
		print('Image Couldn\'t be downloaded')
		# If the image could not be downloaded this is most likely due to their being no street view coverage for the 
		# given location, in this case the user is redirected to the no_coverage page
		return redirect(url_for('no_coverage'))

""" Route for running DenseCap on an image. This route works by passing the image filename into the URL parameter. The
filename is then passed into the run_model function where the filename is used to locate the image within the UPLOAD_FOLDER directory. This route also changes the current working directory from Flask to DenseCap to access the
script for running DenseCap. The shell command which runs DenseCap is then executed using subprocess with the image
path also being passed into the command, once Densecap has finished running this route is redirected to the page which
displays the captions generated by DenseCap """ 
# Passing the image filename as the URL parameter
@app.route('/uploads/<filename>')
# Accessing the image filename from the URL parameter
def run_model(filename):
	# Checking if the current working directory equals flask, this will only be true when the server first starts
	if _directory_state['directory'] == 'flask':
		# If the current working directory does equals flask the directroy is changed to densecap
		os.chdir(os.path.join(os.getcwd(), 'densecap'))
    # Changing the _directory_state mutable value to densecap so that the directory does not change this changed every
		# time this function is called
		_directory_state['directory'] = 'densecap'
	# Retrieving the image path
	img_path = os.path.join('../static/images/', filename)
	# Using the Popen method from the module subprocess to run the DenseCap shell command
	# The DenseCap command takes the following arguments: 
	# "th" which is used to run torch
	# "run_model.lua"  which is the script that runs the model on an image
	# "-input_image" flag for specifying an input image
	# The command then takes the path to the image
	# "-gpu" and "-1" flags for disabling the default GPU mode so that the model can run in CPU mode instead, this is
	# because GPU mode can only be used with an NVIDIA GPU.  
	run_model = subprocess.Popen(['th', 'run_model.lua', '-input_image', img_path, '-gpu', '-1'])
  # Waiting for the command to finish before running the next line of code
	run_model.wait()
	# Redirecting to the route which display the captions generated by DenseCap and passing the filename into the URL
	return redirect(url_for('view_captions', filename=filename))

""" Route for processing the data generated by DenseCap. When running DenseCap on an image the results are written to
a JSON file inside the Densecap directory. This function opens that JSON file and retrieves the data for the generated
captions, confidence scores and bounding boxes. This data then gets passed through either a function for filtering
captions generated on street view images or a function for filtering captions generated on non street view images,
both of which return a new JSON object. The new JSON data then gets sent to the client once a GET request has been
made to this route. """
@app.route('/results')
def view_results():
	# Opening the JSON file generated by DenseCap
	open_json_captions = open(os.path.join(os.getcwd(), 'vis/data/results.json')).read()
	# Loading the JSON data
	json_captions = json.loads(open_json_captions)
	# Storing the captions, confidence scores and bounding boxes data by accessing the results object, the first array
	# index inside results, then the captions, scores and boxes arrays
	captions, scores, boxes = json_captions['results'][0]['captions'], json_captions['results'][0]['scores'],json_captions['results'][0]['boxes']
	# Checking if a GET request has been made and if the image is a Bing Maps street view image
	if request.method == 'GET' and _street_view['streetView'] == True:
		# Passing the captions, confidence scores and bounding boxes box data into the function for filtering captions of
		# street view images 
		data = filteredstreetViewCaptions(captions, scores, boxes)
		# Sending the filtered captions to the client in JSON format using jsonify
		return jsonify(data)
	# Checking if a GET request has been made to this route and if the image is not a Bing Maps street view image 
	elif request.method == 'GET' and _street_view['streetView'] == False:
		# Passing the captions, confidence scores and bounding boxes box data into the function for filtering non street
		# view images
		data = filteredCaptions(captions, scores, boxes)
		#	Sending the filtered captions to the client in JSON format using jsonify
		return jsonify(data)

""" Route for viewing the captions generated by Densecap it excepts the HTTP methods GET and POST. The caption data is
sent from the route above in JSON format and is received by the client using the fetch API. This route also takes the
image filename as a URL parameter, the filename is then passed into the HTML page so that the captioned image can be
displayed. Furthermore this route also contains a form so that the user can submit feedback on how accurate the
caption was, this works by passing the submitFeedback form into the HTML page, the form data is then added to the
database using the function add_feedback """
# Passing the image filename as the URL parameter
@app.route('/captions/<filename>', methods = ['GET', 'POST'])
# Accessing the image filename from the URL parameter
def view_captions(filename):
	# Creating an instance of the class submitFeedback 
	form = submitFeedback()
	# Checking if the form has been submitted through a POST request and if the form data is valid
	if request.method == 'POST' and form.validate_on_submit():
		# Storing the filename field value from the form
		filename = form.filename.data
		# Storing the captions field value from the form
		captions = form.captions.data
		# Storing the score field value from the form
		score = form.score.data
		# Storing the comments field value from the form
		comments = form.comments.data
		# Adding the form data to the database
		db.add_feedback(filename, captions, score, comments)
		# Message to tell the user that form has been received
		flash('Thank you for your feedback!')
		# Redirect the user to the current page to clear the form fields 
		return redirect(request.url)
	# Displaying the page for viewing the captions and passing in the image filename variable and the form class
	return render_template('view_captions.html', filename=filename, form=form)

# Page for when their is no street view image coverage available
@app.route('/no-coverage')
def no_coverage():
	# Displaying the no coverage page
	return render_template('no_coverage.html')

# Route which catches a 404 exception using the decorator errorhandler
@app.errorhandler(404)
def page_not_found(e):
  # Displaying the page not found page to the user
	return render_template('404.html')

# Route which catches a 500 exception using the decorator errorhandler
@app.errorhandler(500)
def server_error(e):
	# Displaying the server error page to the user
	return render_template('500.html')

""" Running Flask and setting the ssl_context to adhoc which generates a self-signed SSL certificate, this changes the
Hypertext Transfer Protocol from HTTP to HTTPS. This is required for the browser to access the user's geolocation and
the camera as both of these APIs only work through a secure connection. """
if __name__ == '__main__':
	app.run(ssl_context='adhoc')
