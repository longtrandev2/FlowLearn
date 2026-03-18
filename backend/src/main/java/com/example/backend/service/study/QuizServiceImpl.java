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
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizResultRepository quizResultRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
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
            throw new IllegalArgumentException("No quiz found for this study session");
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

    @Override
    @Transactional
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
    @Transactional(readOnly = true)
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