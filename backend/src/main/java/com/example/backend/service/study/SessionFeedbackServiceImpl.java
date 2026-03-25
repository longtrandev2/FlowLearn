package com.example.backend.service.study;

import com.example.backend.dto.study.SessionFeedbackDto;
import com.example.backend.entity.SessionFeedback;
import com.example.backend.entity.StudySession;
import com.example.backend.entity.Quiz;
import com.example.backend.entity.QuizResult;
import com.example.backend.repository.SessionFeedbackRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.QuizRepository;
import com.example.backend.repository.QuizResultRepository;
import com.example.backend.service.ai.AiGenerationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionFeedbackServiceImpl implements SessionFeedbackService {

    private final SessionFeedbackRepository sessionFeedbackRepository;
    private final StudySessionRepository studySessionRepository;
    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final AiGenerationService aiGenerationService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public SessionFeedbackDto getOrGenerateFeedback(String userId, String studySessionId) {
        StudySession session = studySessionRepository.findById(studySessionId)
                .orElseThrow(() -> new RuntimeException("Study session not found: " + studySessionId));
                
        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You do not own this study session");
        }

        Optional<SessionFeedback> existingFeedback = sessionFeedbackRepository.findByStudySessionId(studySessionId);
        if (existingFeedback.isPresent()) {
            return mapToDto(existingFeedback.get());
        }

        // Gather performance data
        StringBuilder performanceData = new StringBuilder();
        
        List<Quiz> quizzes = quizRepository.findByStudySessionId(studySessionId);
        if (!quizzes.isEmpty()) {
            Quiz quiz = quizzes.get(0);
            try {
                QuizResult result = quizResultRepository.findFirstByQuizIdAndUserIdOrderByCompletedAtDesc(quiz.getId(), session.getUserId())
                    .orElse(null);
                if (result != null) {
                    int totalQuestions = result.getAnswers() != null ? result.getAnswers().size() : 0;
                    performanceData.append("Quiz Score: ").append(result.getCorrectCount()).append("/").append(totalQuestions).append("\n");
                } else {
                    performanceData.append("Quiz not yet completed or no results found.\n");
                }
            } catch (Exception e) {
                log.warn("Error finding quiz result for user {}", session.getUserId());
            }
        }
        
        if (performanceData.length() == 0) {
            performanceData.append("No quiz or flashcard reviews found for this session.");
        }

        String jsonResponse = aiGenerationService.generateSessionFeedback(session, performanceData.toString());

        List<String> weakAreas = new ArrayList<>();
        String suggestedFocus = "Keep reviewing the material.";
        int overallScore = 0;

        try {
            // Clean up any markdown blocks if the AI model leaked them
            if (jsonResponse.startsWith("```json")) {
                jsonResponse = jsonResponse.substring(7);
                if (jsonResponse.endsWith("```")) {
                    jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 3);
                }
            }
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            if (rootNode.has("weakAreas") && rootNode.get("weakAreas").isArray()) {
                rootNode.get("weakAreas").forEach(node -> weakAreas.add(node.asText()));
            }
            if (rootNode.has("suggestedFocus")) {
                suggestedFocus = rootNode.get("suggestedFocus").asText();
            }
            if (rootNode.has("overallScore")) {
                overallScore = rootNode.get("overallScore").asInt();
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini feedback JSON: ", e);
            suggestedFocus = "AI returned malformed feedback: " + e.getMessage();
        }

        SessionFeedback feedback = SessionFeedback.builder()
                .id(UUID.randomUUID().toString())
                .studySessionId(studySessionId)
                .weakAreas(weakAreas)
                .suggestedFocus(suggestedFocus)
                .overallScore(overallScore)
                .build();

        SessionFeedback saved = sessionFeedbackRepository.save(feedback);
        return mapToDto(saved);
    }

    private SessionFeedbackDto mapToDto(SessionFeedback entity) {
        return SessionFeedbackDto.builder()
                .id(entity.getId())
                .studySessionId(entity.getStudySessionId())
                .weakAreas(entity.getWeakAreas())
                .suggestedFocus(entity.getSuggestedFocus())
                .overallScore(entity.getOverallScore())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}