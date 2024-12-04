from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

api_key = os.environ.get('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)

model = "gpt-4o-mini"
query = '''
Q. 올해 당신이 가장 많은 시간을 쓴 분야는 무엇인가요?
A. 클라이밍, 코딩

Q. 당신이 올해 목표로 했던 것은 무엇인가요?
A. 3개의 사이드프로젝트 개발, 운동 꾸준히 하기

Q. 올해 목표를 이루었나요?
A. 일부 달성

Q. 올해 가장 기억에 남는 여행지는 어디였나요?
A. 일본, 홋카이도

Q. 가장 기억에 남는 일은 무엇인가요?
A. 여자친구 생일 기념 가평 카라반 캠핑

Q. 올해 가장 큰 고민은 무엇이었나요?
A. 진로, 취업 준비

Q. 내년의 당신을 위해 올해의 당신이 하고 싶은 말은?
A. 흔들리지 말고, 두려움 없이 차근차근 공부해보자.


나 자신에게 질문한 내용과 그에 대한 답변이야. 이 내용을 바탕으로 마치 [올해의 내가 내년의 나에게 쓰는 편지]를 작성해줄 수 있어? 말투는 [편안한 친구에게 대화하는 느낌]으로 작성해줘. [올 한 해를 정리하는 느낌]으로 편지가 작성되면 내년 한 해를 보내는 데 큰 힘이 될 것 같아. [편지의 내용과 밀접한 관련이 있는, 다소 희망적인 그림을 함께 첨부]해주면 좋겠어. 그림은 DALLE를 통해 생성하려고 하니 그림에 대한 상세한 설명을 프롬프트처럼 적어줘. 편지와 프롬프트 사이에는 '====='를 넣어서 구분하기 쉽게 해줘. 편지의 내용이 다소 뻔하지 않게. 너무 질문과 답변을 연결만 해놓은 느낌을 주지 말고. 자연스러운 문맥에서 공감과 응원, 피드백을 포함시켰으면 좋겠어. 받는 사람이 놀랄 정도로 감동스럽게 말이야.
'''

messages = [{
    "role": "system",
    "content": "You are a Korean literature writer."
}, {
    "role": "user",
    "content": query
}]

response = client.chat.completions.create(model=model, messages=messages)
answer = response.choices[0].message.content

print(answer)

prompt = answer.split('=====')[1]

response = client.images.generate(
    model="dall-e-3",
    prompt=prompt + "\n image style: 따뜻한 색조의 인상주의 스타일로 그려진 그림",
)

print(response.data[0].url)