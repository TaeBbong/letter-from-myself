import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Intro from './pages/Intro';
import Questionnaire from './pages/Questionnaire';
import Result from './pages/Result';

// MUI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/questions" element={<Questionnaire />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
