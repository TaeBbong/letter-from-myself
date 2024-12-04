import requests
import json

# url = "https://us-central1-fromitome.cloudfunctions.net/call_gpt_handler"
url = "https://call-gpt-handler-wasoaojb7q-uc.a.run.app"
headers = {"Content-Type": "application/json"}
data = {}

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 200:
    print("Response:", response.json())
else:
    print("Error:", response.status_code, response.text)
