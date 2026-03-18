package com.example.backend.service.study;

import com.example.backend.dto.study.QuizDto;
import com.example.backend.dto.study.QuizResultDto;
import com.example.backend.dto.study.SubmitQuizRequest;

public interface QuizService {
    QuizDto getQuizBySession(String userEmail, String sessionId);
    QuizResultDto submitQuizResult(String userEmail, String quizId, SubmitQuizRequest request);
    QuizResultDto getQuizResult(String userEmail, String resultId);
}