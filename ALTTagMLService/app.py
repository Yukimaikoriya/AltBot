# Import necessary libraries
from flask import Flask, render_template, request, jsonify
import requests
import os
import io
from PIL import Image
from transformers import pipeline
import base64
app = Flask(__name__)
image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")
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
    
@app.route("/alt_model_endpoint", methods=["POST"])
def function_for_api():
    try:
        file_data = request.json.get("file")
        
        if not file_data:
            return jsonify({"error": "No file provided"})

        # Convert base64-encoded file data to bytes
        image_bytes = io.BytesIO(base64.b64decode(file_data))

        # Convert bytes to Pillow Image object
        image = Image.open(image_bytes)

        # Use the Hugging Face pipeline to get text from the image
        result = image_to_text(image)

        # Return the result as JSON response
        return jsonify({"alt_tag": result[0]["generated_text"]})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port="5001")
