import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <Box
      textAlign="center"
      sx={{
        backgroundImage: 'url(https://via.placeholder.com/800x600?text=Holiday+Theme)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        올해의 내가 내년의 나에게
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        내년의 나에게 따뜻한 편지를 남겨보세요.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/questions')} // 네비게이션 복구
      >
        시작하기
      </Button>
    </Box>
  );
};

export default Intro;
