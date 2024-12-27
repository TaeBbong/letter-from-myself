import axios from 'axios';
import { useCallback } from 'react';

const useGPT = () => {
  const fetchGPTResult = useCallback(async (answers) => {
    const apiEndpoint = 'https://call-gpt-handler-wasoaojb7q-uc.a.run.app'; // Firebase Functions API URL
    // const apiEndpoint = 'https://test-handler-wasoaojb7q-uc.a.run.app';
    // const apiEndpoint = 'http://127.0.0.1:5001/fromitome/us-central1/call_gpt_handler'
    // const apiEndpoint = 'http://127.0.0.1:5001/fromitome/us-central1/test_handler'

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
        const { id, letter, image } = response.data;
        return { id, letter, image };
      } else {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching GPT result:', error.message);
      throw error;
    }
  }, []);

  return { fetchGPTResult };
};

export default useGPT;
