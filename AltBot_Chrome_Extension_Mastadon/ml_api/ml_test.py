import requests

def query(API_TOKEN):
    model = 'nlpconnect/vit-gpt2-image-captioning'
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    # image_path = "./demo.jpg"

    # # Check if the image file exists
    # if not os.path.exists(image_path):
    #     return {"error": "Image file does not exist"}

    # with open(image_path, "rb") as image_file:
    #     try:
    #         # Try to encode the image file
    #         encoded_string = base64.b64encode(image_file.read()).decode()
    #     except Exception as e:
    #         return {"error": f"Error encoding image: {str(e)}"}

    data = {
        "inputs": "https://ankur3107.github.io/assets/images/image-captioning-example.png"
    }

    try:
        # Try to send a request to the API endpoint
        response = requests.post(
            f'https://api-inference.huggingface.co/models/{model}',
            headers=headers,
            json=data
        )
    except Exception as e:
        return {"error": f"Error sending request: {str(e)}"}
    
    print(response.json()[0]['generated_text'])

    return response.json()

query("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")