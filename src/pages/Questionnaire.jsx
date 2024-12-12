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
  "내년의 당신을 위해 올해의 당신이 하고 싶은 말은?"
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
    <Box
      textAlign="center"
      sx={{
        backgroundImage: 'url(https://oaidalleapiprodscus.blob.core.windows.net/private/org-mvGNPG6dEerVMEJd8gHxcsUf/user-VooybjNYLmZIQeiRzan1yiLu/img-TNtkoqK6PdRYZ1kDIOz1Wd9Z.png?st=2024-12-09T11%3A04%3A03Z&se=2024-12-09T13%3A04%3A03Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-12-08T23%3A29%3A16Z&ske=2024-12-09T23%3A29%3A16Z&sks=b&skv=2024-08-04&sig=1aPpNTC5422yjUO4nQ0k79VANEr5SUatdka9eyLsm34%3D)',
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
          {questions[currentQuestion]}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="답변을 입력하세요"
          onChange={handleAnswer}
          value={answers[currentQuestion] || ''}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={nextQuestion}
          fullWidth
        >
          {currentQuestion < questions.length - 1 ? '다음' : '완료'}
        </Button>
      </Card>
    </Box>
  );
};

export default Questionnaire;
