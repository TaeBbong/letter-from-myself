import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Intro from './pages/Intro';
import Questionnaire from './pages/Questionnaire';
import Result from './pages/Result';
import Footer from './components/Footer';

// 연말 감성 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#A52A2A', // 파스텔 톤의 버건디
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFE4E1', // 따뜻한 분홍 톤
    },
    background: {
      default: '#FFF8F0', // 부드러운 연말 배경색
    },
    christmasGreen: {
      main: '#6BA292', // 파스텔 톤의 세이지 그린
      contrastText: '#fff', 
    },
  },
  typography: {
    fontFamily: `'Quicksand', sans-serif`,
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.8,
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/questions" element={<Questionnaire />} />
        <Route path="/result" element={<Result />} />
        <Route path="/result/:resultId" element={<Result />} />
      </Routes>
      </div>
      <Footer />
      </div>
    </Router>
  </ThemeProvider>
);

export default App;
