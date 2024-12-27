import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main', // 버건디 배경
        color: 'primary.contrastText', // 흰색 텍스트
        textAlign: 'center',
        py: 2, // 상하 여백
        mt: 4, // 상단 마진
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()}{' '}
        <Link
          href="https://github.com/TaeBbong"
          target="_blank"
          rel="noopener"
          sx={{
            color: 'secondary.main', // 따뜻한 분홍색
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
