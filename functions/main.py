# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
from openai import OpenAI
import os, json

initialize_app()

@https_fn.on_request(secrets=["OPENAI_API_KEY"])
def call_gpt_handler(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Max-Age": "3600",
        }

        return ("", 204, headers)
    
    headers = {"Access-Control-Allow-Origin": "*"}

    try:
        # 클라이언트에서 보낸 데이터
        data = req.get_json()
        if not isinstance(data, dict):
            return https_fn.Response(
                "Invalid request body. Expected JSON object.", 
                status=400,
                headers=headers
            )
        # user_input = data.get("input", "")

        OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

        questions = [
            "올해 당신이 가장 많은 시간을 쓴 분야는 무엇인가요?",
            "당신이 올해 목표로 했던 것은 무엇인가요?",
            "올해 목표를 이루었나요?",
            "올해 가장 기억에 남는 여행지는 어디였나요?",
            "가장 기억에 남는 일은 무엇인가요?",
            "올해 가장 큰 고민은 무엇이었나요?",
            "내년의 당신을 위해 올해의 당신이 하고 싶은 말은?"
        ]

        answers = data['answers']
        
        if not isinstance(answers, list) or len(answers) != len(questions):
            return https_fn.Response(
                "Invalid 'answers' format. Expected a list with 7 items.", 
                status=400,
                headers=headers
            )
        
        query_parts = [f"Q. {q}\nA. {a}" for q, a in zip(questions, answers)]
        query = "\n\n".join(query_parts)
        query += "\n\n나 자신에게 질문한 내용과 그에 대한 답변이야. 이 내용을 바탕으로 마치 [올해의 내가 내년의 나에게 쓰는 편지]를 작성해줄 수 있어? 말투는 [편안한 친구에게 대화하는 느낌]으로 작성해줘. [올 한 해를 정리하는 느낌]으로 편지가 작성되면 내년 한 해를 보내는 데 큰 힘이 될 것 같아. [편지의 내용과 밀접한 관련이 있는, 다소 희망적인 그림을 함께 첨부]해주면 좋겠어. 그림은 DALLE를 통해 생성하려고 하니 그림에 대한 상세한 설명을 프롬프트처럼 적어줘. 편지와 프롬프트 사이에는 '====='를 넣어서 구분하기 쉽게 해줘. 편지의 내용이 뻔하지 않게. NEVER just link each questions and answers. 자연스러운 문맥에서 공감과 응원, 피드백을 포함시켰으면 좋겠어. 받는 사람이 놀랄 정도로 감동스럽게 말이야." 
        
        client = OpenAI(api_key=OPENAI_API_KEY)

        model = "gpt-4o-mini"
        messages = [{
            "role": "system",
            "content": "You are a Korean literature writer."
        }, {
            "role": "user",
            "content": query
        }]

        # GPT API 호출
        response = client.chat.completions.create(model=model, messages=messages)

        try:
            letter = response.choices[0].message.content.split('=====')[0]
            prompt = response.choices[0].message.content.split('=====')[1]
        except Exception as e:
            return https_fn.Response(
            json.dumps({"error": str(e), "note": f"{letter}, {prompt}"}), status=404, mimetype="application/json", headers=headers
        ) 

        response2 = client.images.generate(model="dall-e-3", prompt=prompt + '\nstyle: 수채화 스타일, colors: 파스텔 톤, else: 사람은 최대한 등장시키지 않고, 나오더라도 뒷모습 정도만 나오게')
        cover = response2.data[0].url

        # GPT 응답 전송
        return https_fn.Response(json.dumps({"letter": letter, "image": cover}), status=200, mimetype="application/json", headers=headers)

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}), status=500, mimetype="application/json", headers=headers
        )