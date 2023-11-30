# Import necessary libraries
from flask import Flask, render_template, request, jsonify
import requests
import os
import io
from PIL import Image
from transformers import pipeline
import base64
import json

app = Flask(__name__)
image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

# Endpoint for rendering the home page
@app.route('/')
def index():
    """
    Renders the home page.
    """
    return render_template('index.html')

# Endpoint for handling image upload and API call
@app.route('/upload', methods=['POST'])
def upload():
    """
    Handles image upload and makes an API call to process the image.
    """
    # Check if the POST request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        # Call the API using requests
        api_url = 'http://127.0.0.1:5001/alt_model_endpoint'
        file_data = file.read()
        file_data_base64 = base64.b64encode(file_data).decode('utf-8')
        payload = {
            "file": file_data_base64  # "file" is the key pointing to the file data
        }
        json_payload = json.dumps(payload)
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, data=json_payload, headers=headers)

        # Return the API response as JSON
        return jsonify({'result': response.json()})

# Endpoint for hosting the ML model
@app.route("/alt_model_endpoint", methods=["POST"])
def function_for_api():
    """
    API endpoint to process uploaded image using an alternative model.
    """
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
    app.run(debug=True, port=5001)
