from flask import Flask, request
import requests
import json
import time
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)
auth = HTTPBasicAuth()
pickle_filename = "cache_dict.pickle"

# Add your username and password
USERNAME = "your_username"
PASSWORD = "your_password"


@auth.verify_password
def verify_password(username, password):
    return username == USERNAME and password == PASSWORD


@app.route('/', methods=['GET', 'POST'])
@auth.login_required
def handle_request():
    if os.path.exists(pickle_filename):
        with open(pickle_filename, 'rb') as file:
            cache_dict = pickle.load(file)
    else:
        cache_dict = {}
        with open(pickle_filename, 'wb') as file:
            pickle.dump(cache_dict, file)

    try:
        data = request.json
        url = data.get('input')
        if not url:
            raise ValueError('Missing input URL')

        if url in cache_dict:
            result = {'text': cache_dict[url], 'timestamp': time.time()}
            return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'Error processing: {str(e)}'}), 400
    
    API_TOKEN = "Insert_Token_Here"
    model = 'nlpconnect/vit-gpt2-image-captioning'
    headers = {"Authorization": f"Bearer {API_TOKEN}"}

    try:
        # Try to send a request to the API endpoint
        response = requests.post(
            f'https://api-inference.huggingface.co/models/{model}',
            headers=headers,
            json={"inputs": url}
        )
        response.raise_for_status()
    except Exception as e:
        return jsonify({'error': f'Error getting response from endpoint: {str(e)}'}), 500
    
    try:
        alt_text = response.json()[0]['generated_text']
    except Exception as e:
        return jsonify({'error': f'Error subtracting text: {str(e)}'}), 500
    
    result = {'text': alt_text, 'timestamp': time.time()}
    cache_dict[url] = alt_text

    with open(pickle_filename, 'wb') as file:
        pickle.dump(cache_dict, file)
        
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
