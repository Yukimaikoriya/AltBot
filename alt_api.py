from flask import Flask, request, jsonify
from transformers import pipeline
from PIL import Image
import io

app = Flask(__name__)
image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")


@app.route("/", methods=["GET"])
def index():
    return "home"


@app.route("/api_endpoint", methods=["POST"])
def function_for_api():
    # Check if the POST request contains a file

    print(request)
    print(request.files)

    if "file" not in request.files:
        return jsonify({"error": "No file provided"})

    img = request.files["file"]
    print(img.filename)

    # Check if the file is empty
    if img.filename == "":
        return jsonify({"error": "No file selected"})

    # Check if the file is an allowed format (you can customize this based on your needs)
    allowed_extensions = {"png", "jpg", "jpeg", "gif"}
    if (
        "." not in img.filename
        or img.filename.rsplit(".", 1)[1].lower() not in allowed_extensions
    ):
        return jsonify({"error": "Invalid file format"})

    # Read the image and convert it to bytes
    image_bytes = img.read()
    img.close()

    try:
        # Convert bytes to Pillow Image object
        image = Image.open(io.BytesIO(image_bytes))

        # Use the Hugging Face pipeline to get text from the image
        result = image_to_text(image)
        print(f"Result: {result}")
        # Return the result as JSON response
        return jsonify({"result": result[0]["generated_text"]})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)
