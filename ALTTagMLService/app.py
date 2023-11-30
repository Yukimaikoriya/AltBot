from flask import Flask, render_template, request, jsonify
import io, requests
from PIL import Image
from transformers import pipeline

app = Flask(__name__)
image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

# Endpoint for rendering the home page
@app.route('/')
def index():
    return render_template('index.html')

@app.route("/alt_model_endpoint", methods=["POST"])
def function_for_api():

    if "file" not in request.files:
        return jsonify({"error": "No file provided"})

    img = request.files["file"]
    # print(img.filename)

    # Check if the file is empty
    if img.filename == "":
        return jsonify({"error": "No file selected"})

    # Read the image and convert it to bytes
    image_bytes = img.read()
    img.close()

    try:
        # Convert bytes to Pillow Image object
        image = Image.open(io.BytesIO(image_bytes))

        # Use the Hugging Face pipeline to get text from the image
        result = image_to_text(image)

        return jsonify({"alt_tag": result[0]["generated_text"]})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"})

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

        # Call the API using requests
        api_url = 'http://127.0.0.1:5000/alt_model_endpoint'
        response = requests.post(api_url, files={'file': file})

        # Return the API response as JSON
        return jsonify({'result': response.json()})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
