package com.example.backend.service.study;

import com.example.backend.dto.study.QuizDto;
import com.example.backend.dto.study.QuizQuestionDto;
import com.example.backend.dto.study.QuizResultDto;
import com.example.backend.dto.study.SubmitQuizRequest;

import java.util.List;

public interface QuizService {
    QuizDto getQuizBySession(String userEmail, String sessionId);
    QuizDto getQuizById(String userEmail, String quizId);
    List<QuizQuestionDto> getQuizQuestions(String userEmail, String quizId);
    QuizResultDto submitQuizResult(String userEmail, String quizId, SubmitQuizRequest request);
    QuizResultDto getQuizResult(String userEmail, String resultId);
}