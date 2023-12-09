import requests as rq

BASE_URL = 'https://yuuu.pythonanywhere.com/'

payload = {'input': 'https://ankur3107.github.io/assets/images/image-captioning-example.png'}

r = rq.get(BASE_URL, params=payload)
json_r = r.json()

print(json_r['text'])