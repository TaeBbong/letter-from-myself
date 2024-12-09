import axios from 'axios';

const useGPT = () => {
  const fetchGPTResult = async (answers) => {
    const apiEndpoint = 'https://call-gpt-handler-wasoaojb7q-uc.a.run.app'; // Firebase Functions API URL

    // 요청 데이터 준비
    const requestData = {
      answers: answers,
    };

    try {
      // API 요청 보내기
      const response = await axios.post(apiEndpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 응답 데이터 추출
      if (response.status === 200) {
        const { letter, cover } = response.data;
        return { letter, cover };
      } else {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching GPT result:', error.message);
      throw error;
    }
  };

  return { fetchGPTResult };
};

export default useGPT;
