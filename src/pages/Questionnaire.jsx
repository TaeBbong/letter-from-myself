import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const questions = [
  "올해 당신이 가장 많은 시간을 쓴 분야는 무엇인가요?",
  "당신이 올해 목표로 했던 것은 무엇인가요?",
  "올해 목표를 이루었나요?",
  "올해 가장 기억에 남는 여행지는 어디였나요?",
  "가장 기억에 남는 일은 무엇인가요?",
  "올해 가장 큰 고민은 무엇이었나요?",
  "내년의 나를 위해 올해의 당신이 하고 싶은 말은?"
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (event) => {
    const value = event.target.value;
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      localStorage.setItem('answers', JSON.stringify(answers));
      navigate('/result');
    }
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault(); // 기본 Enter 동작 방지
  //     const value = e.target.value.trim();
  //     if (value) {
  //       setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  //       nextQuestion();
  //     }
  //   }
  // };

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
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {`${currentQuestion + 1}/${questions.length}`}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {questions[currentQuestion]}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="답변을 입력하세요"
          onChange={handleAnswer}
          value={answers[currentQuestion] || ''}
          // onKeyDown={handleKeyDown}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={nextQuestion}
          fullWidth
          disabled={!answers[currentQuestion]?.trim()} // 빈 답변일 경우 버튼 비활성화
        >
          {currentQuestion < questions.length - 1 ? '다음' : '완료'}
        </Button>
      </Card>
    </Box>
  );
};

export default Questionnaire;
