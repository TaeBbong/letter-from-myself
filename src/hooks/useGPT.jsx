import axios from 'axios';

const useGPT = () => {
  const fetchGPTResult = async (answers) => {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        prompt: `다음 답변을 바탕으로 내년의 나에게 보내는 편지를 작성해주세요: ${JSON.stringify(answers)}`,
        max_tokens: 500,
        model: 'text-davinci-003',
      },
      {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
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
