package com.example.backend.service.ai;

import com.example.backend.entity.StudySession;
import java.util.List;

public interface AiGenerationService {
    
    /**
     * Generates a summary for the given study session based on its document content.
     */
    String generateSummary(StudySession session, String documentText);
    
    /**
     * Generates a list of flashcards for the given study session.
     * Returns raw json string that will be parsed.
     */
    String generateFlashcards(StudySession session, String documentText, int count);
    
    /**
     * Generates a quiz for the given study session.
     * Returns raw json string that will be parsed.
     */
    String generateQuiz(StudySession session, String documentText, String cognitiveLevel);
}