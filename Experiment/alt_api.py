import base64
import io

from flask import Flask, request, jsonify
from PIL import Image
from transformers import pipeline

app = Flask(__name__)
image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")


@app.route("/", methods=["GET"])
def index():
    return "home"


@app.route("/api_endpoint", methods=["POST"])
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
    
    
if __name__ == "__main__":
    app.run(debug=True)
