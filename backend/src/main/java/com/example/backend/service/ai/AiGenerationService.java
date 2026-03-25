package com.example.backend.service.ai;

import com.example.backend.entity.StudySession;

public interface AiGenerationService {
    String generateSummary(StudySession session, String documentText);
    String generateFlashcards(StudySession session, String documentText, int count);
    String generateQuiz(StudySession session, String documentText, String cognitiveLevel);
    String generateSessionFeedback(StudySession session, String performanceData);
}
