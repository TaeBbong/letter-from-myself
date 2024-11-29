import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const questions = [
  '올해 가장 기억에 남는 일은 무엇인가요?',
  '내년에 꼭 이루고 싶은 목표는 무엇인가요?',
  '내년의 나에게 한마디를 남겨보세요.',
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (event) => {
    setAnswers({ ...answers, [currentQuestion]: event.target.value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      localStorage.setItem('answers', JSON.stringify(answers));
      navigate('/result');
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h6" gutterBottom>
        {questions[currentQuestion]}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="답변을 입력하세요"
        onChange={handleAnswer}
        value={answers[currentQuestion] || ''}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={nextQuestion}>
        {currentQuestion < questions.length - 1 ? '다음' : '완료'}
      </Button>
    </Box>
  );
};

export default Questionnaire;
