from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/', methods = ['GET', 'POST'])
def handle_request():
    url = str(request.args.get('input'))

    API_TOKEN = "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"
    model = 'nlpconnect/vit-gpt2-image-captioning'
    headers = {"Authorization": f"Bearer {API_TOKEN}"}

    data = {"inputs":url}

    try:
        # Try to send a request to the API endpoint
        response = requests.post(
            f'https://api-inference.huggingface.co/models/{model}',
            headers=headers,
            json=data
        )
    except Exception as e:
        return ("error: Error processing model request - %s"%(str(e)))

    try:
      alt_text = response.json()[0]['generated_text']
    except Exception as e:
        print(e)
        return ("error: Error processing %s"%(str(e)))

    return alt_text

if __name__ == "__main__":
    app.run(debug=True)
