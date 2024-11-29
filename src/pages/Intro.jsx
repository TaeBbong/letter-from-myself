import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4" gutterBottom>
        올해의 내가 내년의 나에게
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/questions')}>
        시작하기
      </Button>
    </Box>
  );
};

export default Intro;
