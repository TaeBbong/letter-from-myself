# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## TODO

- [-] 요청 두번씩 호출되는 것
    - React의 개발단계 검사모드인 StrictMode 때문에 2번 렌더링 됨
    - 빌드하여 배포 모드로 실행하면 1번만 잘 실행됨
- [-] firebase storage 활용 이미지 저장, url 공유
- [-] prompt missing 에러 확인, 조치
- [-] 편지 규격 맞추기(글자 수, 시작/끝)
- [ ] result 페이지의 url을 따로 저장하여, url채로 공유하기
- [ ] 결과 저장 일단은 cors proxy로 조치는 했음, 저장 포맷 더 이쁘게 만들기(아니면 걍 원본 이미지만 받아가던가)
- [-] 예시 데이터 전송해주는 테스트용 api 생성

## Firebase Functions 관련 명령어(python)

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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
