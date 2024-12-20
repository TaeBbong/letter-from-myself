import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, Card } from '@mui/material';
import useGPT from '../hooks/useGPT';
import Lottie from 'lottie-react';
import loadingAnimation from '../loading-animation.json';

const Result = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const createCustomImage = async () => {
    const letterExcerpt = result.letter.split('\n').slice(0, 3).join('\n') + '...';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = 500;
    const height = 700;
    canvas.width = width;
    canvas.height = height;

    // Background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // Add styled logo text
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.fillStyle = '#333';
    context.fillText('From I to Me', width / 2, 60);

    // Add generated illustration with proxy
    if (result.image) {
      const image = new Image();
      const proxyUrl = 'https://corsproxy.io/?url='; // Replace with your proxy
      image.crossOrigin = 'anonymous'; // Enable CORS
      image.src = proxyUrl + result.image;

      try {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });
        context.drawImage(image, 50, 100, 400, 300);
      } catch (error) {
        console.error('Failed to load image:', error);
        alert('이미지를 로드하는 데 실패했습니다. 이미지 없이 캡처를 진행합니다.');
      }
    }

    // Add letter excerpt
    context.font = '18px Arial';
    context.textAlign = 'left';
    context.fillStyle = '#000';
    const lines = letterExcerpt.split('\n');
    lines.forEach((line, index) => {
      context.fillText(line, 50, 450 + index * 30);
    });

    // Convert to image and download
    try {
      const finalImageURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = finalImageURL;
      downloadLink.download = 'letter-capture.png';
      downloadLink.click();
    } catch (error) {
      console.error('Failed to export canvas:', error);
      alert('이미지 저장에 실패했습니다.');
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
        <Typography variant="h5" gutterBottom sx={{ px: 2, pt: 2 }}>
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
          <Typography variant="body1" gutterBottom>
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
            onClick={createCustomImage}
          >
            결과 저장
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Result;
