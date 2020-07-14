# -------------------------------------------------
# This file is used for connecting to the database. 
# -------------------------------------------------

# Importing pymysql to connect to MySQL database using python
import pymysql

""" Class for connecting and inserting data into the database """ 
class DBConnect:
	# Function for connecting to the database with 
	def __init__(self):
		# Connecting to the database for Describe My Location on the localhost as the root user 
		self.db = pymysql.connect(host='localhost',	user='root', db='describe_my_location')
	# Function for inserting data into the database the function takes the image filename name as a string, the captions
	# as as string, user's score as an integer and the user's comments as a string
	def add_feedback(self, filename, captions, score, comments):
		# SQL query for inserting the data into the images table
		query = 'INSERT INTO images (filename, captions, score, comments) VALUES (%s, %s, %s, %s)'
		# Calling the object cursor for interacting with the database
		with self.db.cursor() as cursor:
			# Executing the SQL query using the cursor
			cursor.execute(query, (filename, captions, score, comments))
			# Saving the changes
			return self.db.commit()