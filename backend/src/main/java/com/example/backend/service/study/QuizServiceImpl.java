package com.example.backend.service.study;

import com.example.backend.dto.study.QuizDto;
import com.example.backend.dto.study.QuizQuestionDto;
import com.example.backend.dto.study.QuizResultDto;
import com.example.backend.dto.study.SubmitQuizRequest;
import com.example.backend.entity.Quiz;
import com.example.backend.entity.QuizQuestion;
import com.example.backend.entity.QuizResult;
import com.example.backend.entity.StudySession;
import com.example.backend.entity.User;
import com.example.backend.entity.json.QuizAnswerRecord;
import com.example.backend.repository.QuizQuestionRepository;
import com.example.backend.repository.QuizRepository;
import com.example.backend.repository.QuizResultRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.entity.Document;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.service.ai.AiGenerationService;
import com.example.backend.service.file.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizResultRepository quizResultRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final AiGenerationService aiGenerationService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public QuizDto getQuizBySession(String userEmail, String sessionId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        StudySession session = studySessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Study session not found"));

        if (!session.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this session's quiz");
        }

        // For now, getting the first quiz associated with the session.
        List<Quiz> quizzes = quizRepository.findByStudySessionId(sessionId, PageRequest.of(0, 1)).getContent();
        if (quizzes.isEmpty()) {
            return generateAndSaveQuiz(session);
        }
        
        Quiz quiz = quizzes.get(0);
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByQuestionIndexAsc(quiz.getId());

        return QuizDto.builder()
                .id(quiz.getId())
                .studySessionId(quiz.getStudySessionId())
                .cognitiveLevel(quiz.getCognitiveLevel())
                .totalQuestions(quiz.getTotalQuestions())
                .createdAt(quiz.getCreatedAt())
                .questions(questions.stream().map(q -> QuizQuestionDto.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .options(q.getOptions())
                        .questionIndex(q.getQuestionIndex())
                        .build()).collect(Collectors.toList()))
                .build();
    }


    private QuizDto generateAndSaveQuiz(StudySession session) {
        String stringLevel = "understand";
        String text = getSessionTextContent(session);
        String jsonContent = aiGenerationService.generateQuiz(session, text, stringLevel);
        
        try {
            jsonContent = extractJson(jsonContent);
            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(jsonContent);
            com.fasterxml.jackson.databind.JsonNode questionsNode = root.path("questions");
            
            Quiz quiz = Quiz.builder()
                    .id(UUID.randomUUID().toString())
                    .studySessionId(session.getId())
                    .cognitiveLevel(com.example.backend.enums.CognitiveLevel.UNDERSTAND)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            quiz = quizRepository.save(quiz);
            
            List<QuizQuestionDto> questionDtos = new ArrayList<>();
            if (questionsNode.isArray()) {
                int index = 0;
                for (com.fasterxml.jackson.databind.JsonNode qNode : questionsNode) {
                    java.util.LinkedHashMap<String, String> mapOptions = new java.util.LinkedHashMap<>();
                    char key = 'A';
                    int optIndex = 0;
                    int correctIndex = qNode.path("correctIndex").asInt();
                    com.example.backend.enums.QuizOptionKey correctKey = com.example.backend.enums.QuizOptionKey.A;
                    
                    for (com.fasterxml.jackson.databind.JsonNode opt : qNode.path("options")) {
                        mapOptions.put(String.valueOf(key), opt.asText());
                        if (optIndex == correctIndex) {
                            correctKey = com.example.backend.enums.QuizOptionKey.valueOf(String.valueOf(key));
                        }
                        key++;
                        optIndex++;
                    }
                    
                    QuizQuestion q = QuizQuestion.builder()
                            .id(UUID.randomUUID().toString())
                            .quizId(quiz.getId())
                            .question(qNode.path("question").asText())
                            .options(mapOptions)
                            .questionIndex(index++)
                            .correctKey(correctKey)
                            .explanation(qNode.path("explanation").asText())
                            .build();
                    quizQuestionRepository.save(q);

                    questionDtos.add(QuizQuestionDto.builder()
                            .id(q.getId())
                            .question(q.getQuestion())
                            .options(q.getOptions())
                            .questionIndex(q.getQuestionIndex())
                            .build());
                }
            }
            quiz.setTotalQuestions(questionDtos.size());
            quizRepository.save(quiz);
            
            return QuizDto.builder()
                    .id(quiz.getId())
                    .studySessionId(quiz.getStudySessionId())
                    .cognitiveLevel(quiz.getCognitiveLevel())
                    .totalQuestions(quiz.getTotalQuestions())
                    .createdAt(quiz.getCreatedAt())
                    .questions(questionDtos)
                    .build();
            
        } catch (Exception e) {
            log.error("Failed to parse generating quiz", e);
            throw new RuntimeException("Could not generate quiz properly", e);
        }
    }
    
    private String extractJson(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("`" + "json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("`")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("`")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }
    
    private String getSessionTextContent(StudySession session) {
        if (session.getScope() == com.example.backend.enums.StudyScope.FILE) {
            Document doc = documentRepository.findById(session.getScopeId())
                    .orElseThrow(() -> new IllegalArgumentException("Document not found"));
            try {
                return fileStorageService.downloadText(doc.getCloudinaryId() + ".txt");
            } catch (Exception e) {
                log.error("Failed to fetch text content for document {}", doc.getId(), e);
                return "Note: Content could not be extracted or is missing.";
            }
        }
        return "";
    }

    @Override    @Transactional
    public QuizResultDto submitQuizResult(String userEmail, String quizId, SubmitQuizRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        StudySession session = studySessionRepository.findById(quiz.getStudySessionId())
                .orElseThrow(() -> new IllegalArgumentException("Study session not found"));

        if (!session.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to submit to this quiz");
        }

        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByQuestionIndexAsc(quiz.getId());
        Map<String, QuizQuestion> questionMap = questions.stream()
                .collect(Collectors.toMap(QuizQuestion::getId, q -> q));

        int correctCount = 0;
        List<QuizAnswerRecord> answerRecords = new ArrayList<>();

        for (SubmitQuizRequest.SubmitQuizAnswer answer : request.getAnswers()) {
            QuizQuestion q = questionMap.get(answer.getQuestionId());
            if (q == null) {
                continue; // Skip invalid question IDs
            }

            boolean isCorrect = q.getCorrectKey() == answer.getSelectedKey();
            if (isCorrect) {
                correctCount++;
            }

            answerRecords.add(QuizAnswerRecord.builder()
                    .questionId(q.getId())
                    .selectedKey(answer.getSelectedKey())
                    .isCorrect(isCorrect)
                    .build());
        }

        int total = questions.size();
        BigDecimal score = total == 0 ? BigDecimal.ZERO : BigDecimal.valueOf((double) correctCount / total * 100)
                .setScale(2, RoundingMode.HALF_UP);

        QuizResult result = QuizResult.builder()
                .id(UUID.randomUUID().toString())
                .quizId(quiz.getId())
                .userId(user.getId())
                .score(score)
                .correctCount(correctCount)
                .timeSpentSeconds(request.getTimeSpentSeconds())
                .answers(answerRecords)
                .build();

        result = quizResultRepository.save(result);

        return mapToResultDto(result);
    }

    @Override
    @Transactional
    public QuizResultDto getQuizResult(String userEmail, String resultId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        QuizResult result = quizResultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz result not found"));

        if (!result.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to view this quiz result");
        }

        return mapToResultDto(result);
    }

    private QuizResultDto mapToResultDto(QuizResult result) {
        return QuizResultDto.builder()
                .id(result.getId())
                .quizId(result.getQuizId())
                .score(result.getScore())
                .correctCount(result.getCorrectCount())
                .timeSpentSeconds(result.getTimeSpentSeconds())
                .answers(result.getAnswers())
                .completedAt(result.getCompletedAt())
                .build();
    }
}


