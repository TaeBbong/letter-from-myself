# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app, storage
from openai import OpenAI
import os, json, requests
from datetime import datetime

initialize_app()

BUCKET_NAME = "fromitome.firebasestorage.app"

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
        query += '''\n\n나 자신에게 질문한 내용과 그에 대한 답변이야.
        이 내용을 바탕으로 마치 [올해의 내가 내년의 나에게 쓰는 편지]를 작성해줘. 
        편지의 말투는 [편안한 친구에게 대화하는 느낌]이어야 해. 
        [올 한 해를 정리하는 느낌]으로 작성되되, **절대로 각 질문과 답변을 단순 나열하지 말고**, 자연스러운 문맥에서 **공감과 응원, 피드백**을 포함시켜줘. 
        받는 사람이 감동받을 정도로 따뜻하게 작성해줘.
        **Response Template**은 반드시 아래의 양식처럼 작성해야 해:  

        [300자 내외의 내용으로 편지를 작성. 편지는 올해의 성취, 기억, 고민을 짧고 자연스럽게 정리하며 내년의 나에게 따뜻한 응원과 피드백을 전하는 내용이어야 합니다.]
        2024년의 내가
        =====
        [편지 내용과 연결되는 희망적이고 감성적인 그림을 표현하는 Image prompt를 작성. 예: "Bright, familiar air with mountains and a climber reaching the top."]

        **꼭 지킬 조건**:  
        1. 편지 길이는 **900~1000자 범위**로 작성하고, 초과하지 않도록 주의해.  
        2. 양식은 반드시 위에서 제시한 **Response Template**을 그대로 따라야 해.  
        3. 본문, '2024년의 내가' 사이에는 각각 엔터가 들어가야 해('\n')
        4. Image prompt는 편지와 감성적으로 연결되게 작성해.  
        5. 편지와 Image prompt 사이에는 꼭 '====='을 넣어서 구분해야 해.

        **예시 응답**:  
        안녕, 내년의 나야! 올해는 정말 다양한 도전과 성장의 시간이었어. 클라이밍에 몰두하며 나만의 시간을 가졌고, 아름다운 홋카이도에서 잊지 못할 추억을 만들었지. 목표했던 프로젝트는 완벽하지 않았지만 의미 있는 진전을 이뤄냈어. 고민도 많았지만 덕분에 나 자신을 더 이해하게 된 것 같아. 내년엔 더 가볍고 용기 있게, 실패를 두려워하지 말고 나아가길 바랄게. 너는 충분히 잘하고 있어!\n
        2024년의 내가
        =====
        Image prompt: Bright and hopeful scene, featuring a climber approaching the mountain peak under a soft pastel sunrise, symbolizing persistence and new beginnings.
         '''
        
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
        image_url = response2.data[0].url

        response_image = requests.get(image_url)
        if response_image.status_code != 200:
            return https_fn.Response(
                json.dumps({"error": "Failed to download the image"}),
                status=500,
                mimetype="application/json",
                headers=headers
            )

        # 이미지 Firebase Storage에 업로드
        bucket = storage.bucket(BUCKET_NAME)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        blob_path = f"images/{datetime.now().strftime('%Y-%m-%d')}/image_{timestamp}.png"

        blob = bucket.blob(blob_path)
        blob.upload_from_string(response_image.content, content_type="image/png")

        # 이미지의 공개 URL 생성
        blob.make_public()
        image_public_url = blob.public_url

        # GPT 응답 전송
        return https_fn.Response(json.dumps({"letter": letter, "image": image_public_url}), status=200, mimetype="application/json", headers=headers)

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}), status=500, mimetype="application/json", headers=headers
        )