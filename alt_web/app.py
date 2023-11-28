# Import necessary libraries
from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

# Set the path to the folder where you want to save the uploaded images
# UPLOAD_FOLDER = 'uploads'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Endpoint for rendering the home page
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint for handling image upload and API call
@app.route('/upload', methods=['POST'])
def upload():
    # Check if the POST request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        # Save the uploaded file to the upload folder
        # file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        # file.save(file_path)

        # Call the API using requests
        api_url = 'http://127.0.0.1:5000/api_endpoint'
        response = requests.post(api_url, files={'file': file})

        # Remove the uploaded file after the API call
        # os.remove(file_path)

        # Return the API response as JSON
        return jsonify({'result': response.json()})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port="5001")
