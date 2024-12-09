import requests
import json

# url = "https://us-central1-fromitome.cloudfunctions.net/call_gpt_handler"
url = "https://call-gpt-handler-wasoaojb7q-uc.a.run.app"
headers = {"Content-Type": "application/json"}
data = {
          "answers": [
              "클라이밍, 코딩",
              "3개의 사이드프로젝트 개발, 운동 꾸준히 하기",
              "일부 달성",
              "일본, 홋카이도",
              "여자친구 생일 기념 가평 카라반 캠핑",
              "진로, 취업 준비",
              "흔들리지 말고, 두려움 없이 차근차근 공부해보자."
          ]
      }

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 200:
    print("Response:", response.json())
else:
    print("Error:", response.status_code, response.text)
