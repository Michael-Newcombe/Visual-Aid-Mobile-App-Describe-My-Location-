# -----------------------------------------------------------------------------
# This file is used for creating the form for submitting feedback on a caption. 
# -----------------------------------------------------------------------------

# Importing FlaskForm from flask_wtf to integrate Flask with WTForms 
from flask_wtf import FlaskForm
# Importing the following from wtforms:
# A form string field
# A form radio field 
# A form text area field 
# Validators to add validation functionality to the forms
from wtforms import StringField, RadioField, TextAreaField, SubmitField, validators

""" Defining a form class which takes a FlaskForm as its argument, the form class is used to define the form fields as
class variables. """
class submitFeedback(FlaskForm):
	# Creating a string field for the form with the attribute name filename and validators set to DataRequired this
	# means that this form cannot be submitted if this field is empty. This field is used for storing the image filename.
	filename = StringField('filename', [validators.DataRequired()])
	# Creating a string field for the form with the attribute name captions with validators also set to DataRequired.
	# This field is used for storing the generated captions.
	captions = StringField('captions', [validators.DataRequired()])
	# Creating radio button fields with the attribute name scores, then using the argument choices[] to create five
	# radio buttons where the first argument is the radio button value and the second is the label. The function coerce
	# is then being used to convert the values back to integers as the data is represented as strings within the HTML.
	# These fields are used for storing the user's score rating.
	score = RadioField('scores', choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], coerce=int)
	# Creating a text area field with the attribute name comments and setting validators to optional so that the form can
	# be submitted without filling in this field, also validators.length is being used so that the user can only submit
	# a maximum of 1000 characters for this field. This field is used for storing any comments that the user wants to
	# add regarding the captions.
	comments = TextAreaField('comments', [validators.optional(), validators.length(max=1000)])
	# Creating a submit field button to submit the form data
	submit = SubmitField('submit')

  