import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main', // 배경색: 버건디
        color: 'primary.contrastText',  // 텍스트 색상: 흰색
        textAlign: 'center',
        py: 2, // 상하 여백
        mt: 'auto', // 자동 하단 정렬
        zIndex: 10, // 다른 요소보다 위에 표시
        position: 'relative', // zIndex가 작동하려면 position 설정 필요
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} 
        {' '}
        <Link
          href="https://github.com/TaeBbong"
          target="_blank"
          rel="noopener"
          sx={{
            color: 'secondary.main', // 링크 색상: 분홍색
            textDecoration: 'none',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          TaeBbong
        </Link>
      </Typography>
      <Typography variant="body2">
        Designed with ❤️ and powered by <strong>React</strong>.
      </Typography>
    </Box>
  );
}

export default Footer;
