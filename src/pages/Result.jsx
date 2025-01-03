import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Card } from '@mui/material';
import useGPT from '../hooks/useGPT';
import getResult from '../hooks/getResult';
import Lottie from 'lottie-react';
import loadingAnimation from '../loading-animation.json';
import '../index.css';

const Result = () => {
  const { resultId } = useParams(); 
  const navigate = useNavigate(); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const answers = useMemo(() => {
    const storedAnswers = localStorage.getItem('answers');
    return storedAnswers ? Object.values(JSON.parse(storedAnswers)) : [];
  }, []);
  const { fetchGPTResult } = useGPT();
  const baseUrl = "https://fromitome.web.app"
  const location = useLocation();

  useEffect(() => {
    const handlePopState = () => {
      // 브라우저의 뒤로가기 버튼이 눌렸을 때 초기 페이지로 이동
      navigate('/');
    };

    // popstate 이벤트 리스너 추가
    window.addEventListener('popstate', handlePopState);

    return () => {
      // 컴포넌트 언마운트 시 popstate 이벤트 리스너 제거
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      if (resultId) {
        try {
          const { letter, image } = await getResult(resultId);
          setResult({ letter, image });
        } catch (error) {
          console.error('Failed to fetch result:', error);
          alert('결과를 로드하는 데 실패했습니다.');
          navigate('/');
        }
      } else {
        try {
          const { id, letter, image } = await fetchGPTResult(answers);
          setResult({ letter, image });
          navigate(`/result/${id}`);
        }
        catch(error) {
          console.error('Failed to generate result:', error);
          alert('결과 생성에 실패했습니다.');
          navigate('/');
        }
      }
      setLoading(false);
      localStorage.clear();
    };

    fetchResult();
  }, [answers, resultId, navigate, fetchGPTResult]);

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log(err);
    }
  }

  if (loading || !result) {
    return (
      <Box
        textAlign="center"
        mt={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
        <Typography variant="h6" mt={2}>
          편지를 준비하고 있어요...<br />
          20초만 기다려주세요 :)
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
        p: 3,
      }}
    >
      <Card
        id="result-content"
        sx={{
          width: '100%',
          maxWidth: 500,
          height: '60vh', // 전체 높이의 80%를 카드에 할당
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 3,
          position: 'relative',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ px: 2, pt: 2 }} style={{fontFamily: 'MaruBuri-Bold'}}>
          내년의 나에게 보내는 편지
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2,
            pb: 2,
            maxHeight: 'calc(100% - 64px)', // 버튼 영역 제외
          }}
        >
          <div>
            {result.image ? (
              <img
                src={result.image}
                alt="Generated Illustration"
                style={{ width: '100%', marginTop: '16px', borderRadius: '8px' }}
              />
            ) : (
              <p>이미지 로드 중...</p>
            )}
          </div>
          <Typography variant="body1" gutterBottom style={{fontFamily: 'Oneprettynight'}}>
            {result.letter.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            width: '80%',
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ margin: 0 }} // 버튼 마진 제거
            onClick={() => handleCopyClipBoard(`${baseUrl}${location.pathname}`)}
          >
            링크 저장
          </Button>
          <Button
            variant="contained"
            color="christmasGreen"
            fullWidth
            sx={{ margin: 0 }} // 버튼 마진 제거
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            새로운 편지 만들기
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Result;
