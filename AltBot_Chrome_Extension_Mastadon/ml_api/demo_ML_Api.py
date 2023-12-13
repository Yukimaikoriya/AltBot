from flask import Flask, request
import requests
import json
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', 'POST'])
def handle_request():
    url = str(request.args.get('input'))
    API_TOKEN = "Insert_Token_Here"
    model = 'nlpconnect/vit-gpt2-image-captioning'
    headers = {"Authorization": f"Bearer {API_TOKEN}"}

    data = {"inputs": url}

    try:
        # Try to send a request to the API endpoint
        response = requests.post(
            f'https://api-inference.huggingface.co/models/{model}',
            headers=headers,
            json=data
        )
    except Exception as e:
        return ("error: Error processing %s" % (str(e)))

    try:
        alt_text = response.json()[0]['generated_text']
        # alt_text = response.json()
    except Exception as e:
        return ("error: Error processing %s" % (str(e)))

    r = {'text': alt_text, 'timestamp': time.time()}
    json_dump = json.dumps(r)

    return json_dump


if __name__ == "__main__":
    app.run(debug=True)
