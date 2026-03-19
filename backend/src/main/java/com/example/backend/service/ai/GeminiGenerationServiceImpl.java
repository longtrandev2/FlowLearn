package com.example.backend.service.ai;

import com.example.backend.entity.StudySession;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiGenerationServiceImpl implements AiGenerationService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public String generateSummary(StudySession session, String documentText) {
        log.info("Generating summary for session: {}", session.getId());
        
        String prompt = String.format(
            "Create a comprehensive markdown summary of the following text. " +
            "The learning goal is: %s. " +
            "Text format should be valid Markdown. \n\n" +
            "TEXT:\n%s", 
            session.getGoalId(), 
            truncateText(documentText, 50000) // limit size to fit simple limits, Gemini 2.0 can take more but keeping safe
        );
        
        return callGeminiApi(prompt);
    }

    @Override
    public String generateFlashcards(StudySession session, String documentText, int count) {
        log.info("Generating {} flashcards for session: {}", count, session.getId());
        
        String prompt = String.format(
            "Based on the following text, generate %d flashcards targeting the learning goal: '%s'.\n" +
            "Respond ONLY with a JSON array of objects. Do not include markdown blocks like ```json.\n" +
            "Each object must have exactly two string fields: 'front' and 'back'.\n\n" +
            "TEXT:\n%s", 
            count, session.getGoalId(), truncateText(documentText, 50000)
        );
        
        return callGeminiApi(prompt);
    }

    @Override
    public String generateQuiz(StudySession session, String documentText, String cognitiveLevel) {
        log.info("Generating quiz (level: {}) for session: {}", cognitiveLevel, session.getId());
        
        // Generate a standard multiple choice quiz format
        String prompt = String.format(
            "Based on the following text, generate a 10-question multiple-choice quiz targeting the cognitive level '%s' and learning goal '%s'.\n" +
            "Respond ONLY with a JSON object. Do not include markdown blocks like ```json.\n" +
            "The JSON must have a single key 'questions' containing an array of objects.\n" +
            "Each question object must follow this exact format: \n" +
            "{\n" +
            "  \"question\": \"Question text\",\n" +
            "  \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
            "  \"correctIndex\": 0,\n" +
            "  \"explanation\": \"Why this is requested\"\n" +
            "}\n\n" +
            "TEXT:\n%s", 
            cognitiveLevel, session.getGoalId(), truncateText(documentText, 50000)
        );
        
        return callGeminiApi(prompt);
    }

    private String callGeminiApi(String prompt) {
        String url = geminiApiUrl + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Gemini API v1beta / v1 format
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", new Object[]{part});

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{content});

        // Config logic
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        requestBody.put("generationConfig", generationConfig);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            return extractTextFromResponse(response.getBody());
        } catch (Exception e) {
            log.error("Failed to call Gemini API", e);
            throw new RuntimeException("AI Generation failed", e);
        }
    }

    private String extractTextFromResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        return root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }
    
    private String truncateText(String text, int maxLength) {
        if (text == null) return "";
        return text.length() > maxLength ? text.substring(0, maxLength) : text;
    }
}