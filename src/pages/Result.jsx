import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, Card } from '@mui/material';
import html2canvas from 'html2canvas';
import useGPT from '../hooks/useGPT';
import Lottie from 'lottie-react';
import loadingAnimation from '../loading-animation.json';

const Result = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const answers = useMemo(() => Object.values(JSON.parse(localStorage.getItem('answers'))), []);
  const { fetchGPTResult } = useGPT();

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      const data = await fetchGPTResult(answers);
      setResult(data);
      setLoading(false);
    };

    fetchResult();
  }, [answers, fetchGPTResult]);

  // TODO: 결과 저장 시 로고 + 생성 이미지 형태로 저장
  // TODO: 결과 저장 버튼 sticky bottom
  const captureResult = async () => {
    const resultElement = document.getElementById('result-content');
    const canvas = await html2canvas(resultElement);
    const dataURL = canvas.toDataURL('image/png');
    setImageURL(dataURL);
  };

  const shareToInstagram = () => {
    if (imageURL) {
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'my-future-letter.png';
      link.click();

      alert('이미지를 다운로드한 후 인스타그램 스토리로 업로드하세요!');
    } else {
      alert('이미지를 캡처하는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

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
          편지를 준비하고 있어요...<br/>
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
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingLeft: '8px',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          내년의 나에게 보내는 편지
        </Typography>
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
        <Typography variant="body1" gutterBottom>
          {result.letter.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={captureResult}
        >
          결과 저장
        </Button>
      </Card>
    </Box>
  );
};

export default Result;
