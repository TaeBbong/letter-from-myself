import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import useGPT from '../hooks/useGPT';

const Result = () => {
  const [result, setResult] = useState(null);
  const answers = JSON.parse(localStorage.getItem('answers'));
  const { fetchGPTResult } = useGPT();

  useEffect(() => {
    (async () => {
      const data = await fetchGPTResult(answers);
      setResult(data);
    })();
  }, [answers, fetchGPTResult]);

  if (!result) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>편지를 작성 중입니다...</Typography>
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5" gutterBottom>
        내년의 나에게 보내는 편지
      </Typography>
      <Typography>{result.letter}</Typography>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
        공유하기
      </Button>
    </Box>
  );
};

export default Result;
