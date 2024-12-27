import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <Box
      textAlign="center"
      sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        p: 3,
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // 흰색 반투명 오버레이
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2, // 텍스트를 오버레이 위에 표시
        },
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
