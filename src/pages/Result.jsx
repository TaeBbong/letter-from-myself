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
  const answers = useMemo(() => Object.values(JSON.parse(localStorage.getItem('answers'))), []);
  const { fetchGPTResult } = useGPT();
  const baseUrl = "https://fromitome.web.app"
  const location = useLocation();

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
        }
      }
      setLoading(false);
    };

    fetchResult();
  }, [answers, resultId, navigate, fetchGPTResult]);

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("링크가 복사되었어요.");
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
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            // TODO: 링크 copy하는 것으로 대체
            onClick={() => handleCopyClipBoard(`${baseUrl}${location.pathname}`)}
          >
            링크 저장
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Result;
