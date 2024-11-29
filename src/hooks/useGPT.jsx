import axios from 'axios';

const useGPT = () => {
  const fetchGPTResult = async (answers) => {
    const apiKey = process.env.OPENAI_API_KEY; // 환경 변수에서 API 키 가져오기
    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다. .env 파일을 확인하세요.');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        prompt: `다음 답변을 바탕으로 내년의 나에게 보내는 편지를 작성해주세요: ${JSON.stringify(answers)}`,
        max_tokens: 500,
        model: 'text-davinci-003',
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const letter = response.data.choices[0].text;
    const image = 'https://via.placeholder.com/400'; // 이미지 생성 로직 추가 가능
    return { letter, image };
  };

  return { fetchGPTResult };
};

export default useGPT;
