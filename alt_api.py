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
    # Check if the POST request contains a file

    # print(request)
    # print(request.files)

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
        # print(f"Result: {result}")
        # Return the result as JSON response
        return jsonify({"alt_tag": result[0]["generated_text"]})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)
