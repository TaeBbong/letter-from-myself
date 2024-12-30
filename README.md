# from I to Me : 올해의 내가 내년의 나에게 쓰는 편지

> AI가 생성해주는, 내년의 나에게 쓰는 편지와 그림

![screenshot](./docs/screenshot.png)

## :rocket: 프로젝트 설명

## 💻 기술 스택

<div>
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/mui-007FFF?style=for-the-badge&logo=mui&logoColor=black">
<img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white">
<img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=black">
</div>

## 🛠 업데이트 로그

### [1.0.0]() - 2024-12-27

#### Released

- 초기 프로덕트를 배포하였습니다.
- 요구되는 모든 기능을 구현하여 SNS로도 공유했습니다.

## 📖 개발 기록

- [AI 기반 편지 생성 사이트 개발기](https://taebbong.github.io/)

## WIL : Firebase Functions 관련 명령어(python)

```bash
$ firebase functions:secrets:set API_KEY
$ firebase deploy --only functions
$ firebase emulators:start --only functions
```

```python
@https_fn.on_request(secrets=["OPENAI_API_KEY"])
def call_gpt_handler(req: https_fn.Request) -> https_fn.Response:
    try:
        OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
        print(f'key: {OPENAI_API_KEY}')
```