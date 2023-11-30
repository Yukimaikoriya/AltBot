import requests

pic_file = "./Images/jiraya.png"
your_server_address = "http://127.0.0.1:5000"
# post a request with file and receive response
with open(pic_file, "rb") as f:
    resp = requests.post(f"{your_server_address}/api_endpoint", files={"file": f})
    print(resp.text)
