# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app, storage, firestore, credentials
from openai import OpenAI
import os, json, requests
from datetime import datetime

try:
    cred = credentials.Certificate(".\\fromitome-firebase-adminsdk-hncvs-1d9b4ed8fa.json")
    initialize_app(cred)
except:
    initialize_app()

db = firestore.client()

BUCKET_NAME = "fromitome.firebasestorage.app"

@https_fn.on_request(secrets=["OPENAI_API_KEY"])
def test_handler(req: https_fn.Request) -> https_fn.Response:
    letter = "안녕, 내년의 나야! 올해는 정말 다채로운 순간들로 가득했던 것 같아. 클라이밍에 많은 시간을 투자하며 더 강해졌고, 도전하는 즐거움을 만끽했지. 홋카이도에서의 수채화 같은 풍경과, 강릉 바다에서의 소중한 추억은 내 마음속에 깊게 새겨졌어. 생일날 강릉에서 바라본 바다는 정말 특별했어. 그런 순간들이 있기에 더욱더 감사한 것 같아.\n\n또한, 목표했던 3개의 사이드 프로젝트는 완벽하게 이루진 않았지만, 부분적으로라도 진전을 이룬 것에 큰 의미를 두고 싶어. 작은 성취들이 모여 큰 그림을 그릴 수 있다는 걸 다시 한번 깨달았거든. 올해 고민했던 진로는 지금 생각하면 괜한 걱정이 아닐까 싶기도 해. 나 자신에게 지나치게 엄격하게 굴지 말고, 때로는 그냥 흐르는 대로 가보도록 하자. \n\n내년에는 조금 더 가벼운 마음으로 도전해보길 바래! 실패를 두려워하지 말고, 모든 과정에서 배우는 즐거움을 찾아가길. 매일매일이 소중하고 새로운 기회라는 걸 잊지 말고, 나의 길을 당당히 걸어가길!\n\n2024년의 내가\n"
    image_public_url = "https://storage.googleapis.com/fromitome.firebasestorage.app/images/2024-12-19/image_20241219084736.png"
    
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    headers = {"Access-Control-Allow-Origin": "*"}
    
    return https_fn.Response(json.dumps({"letter": letter, "image": image_public_url}), status=200, mimetype="application/json", headers=headers)

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
        data = req.get_json()
        if not isinstance(data, dict):
            return https_fn.Response(
                "Invalid request body. Expected JSON object.", 
                status=400,
                headers=headers
            )

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

        [900자 내외의 내용으로 편지를 작성. 편지는 올해의 성취, 기억, 고민을 짧고 자연스럽게 정리하며 내년의 나에게 따뜻한 응원과 피드백을 전하는 내용이어야 합니다.]
        2024년의 내가
        =====
        [편지 내용과 연결되는 희망적이고 감성적인 그림을 표현하는 Image prompt를 작성. 예: "Bright, familiar air with mountains and a climber reaching the top."]

        **꼭 지킬 조건**:  
        1. 편지 길이는 **900~1000자 범위**로 작성하고, 900자보다 적거나 1000자를 초과하지 않도록 주의해.  
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

        # Firestore에 데이터 저장
        doc_id = f"result-{timestamp}"  # 고유 ID 생성
        db.collection("results").document(doc_id).set({
            "id": doc_id,
            "letter": letter,
            "image": image_public_url,
            "createdAt": firestore.SERVER_TIMESTAMP
        })

        # GPT 응답 전송
        return https_fn.Response(json.dumps({"id": doc_id, "letter": letter, "image": image_public_url}), status=200, mimetype="application/json", headers=headers)

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}), status=500, mimetype="application/json", headers=headers
        )


@https_fn.on_request()
def get_result_handler(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    headers = {"Access-Control-Allow-Origin": "*"}

    try:
        # 요청에서 ID 가져오기
        doc_id = req.args.get("id")
        if not doc_id:
            return https_fn.Response(
                "Missing 'id' parameter.",
                status=400,
                mimetype="application/json",
                headers=headers
            )

        # Firestore에서 문서 조회
        doc_ref = db.collection("results").document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            return https_fn.Response(
                "Document not found.",
                status=404,
                mimetype="application/json",
                headers=headers
            )

        # 데이터 반환
        return https_fn.Response(
            json.dumps(doc.to_dict(), default=str, indent=2),
            status=200,
            mimetype="application/json",
            headers=headers
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"ERROR": str(e)}),
            status=500,
            mimetype="application/json",
            headers=headers
        )
