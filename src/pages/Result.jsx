import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, CircularProgress, Card } from '@mui/material';
import html2canvas from 'html2canvas';
import useGPT from '../hooks/useGPT';

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
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>편지를 작성 중입니다...</Typography>
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
        <Typography variant="body1" gutterBottom>
          {result.letter.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={captureResult}
        >
          결과 저장
        </Button>
        {imageURL && (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={shareToInstagram}
          >
            인스타그램으로 공유
          </Button>
        )}
      </Card>
    </Box>
  );
};

export default Result;
