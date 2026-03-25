package com.example.backend.service.study;

import com.example.backend.dto.study.CreateStudySessionRequest;
import com.example.backend.dto.study.StudySessionDto;
import com.example.backend.entity.StudySession;
import com.example.backend.entity.User;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ai.AiGenerationService;
import com.example.backend.service.study.SummaryService;
import com.example.backend.service.study.FlashcardService;
import com.example.backend.service.study.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudySessionServiceImpl implements StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final SummaryService summaryService;
    private final FlashcardService flashcardService;
    private final QuizService quizService;

    @Override
    @Transactional
    public StudySessionDto createSession(String userEmail, CreateStudySessionRequest request) {
        User user = getUserByEmail(userEmail);

        // Validate scope ownership to prevent IDOR
        if (request.scope() == com.example.backend.enums.StudyScope.FILE) {
            documentRepository.findByIdAndUserId(request.scopeId(), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Document not found or access denied"));
        } else {
            throw new IllegalArgumentException("Only FILE scope is permitted for study sessions");
        }

        StudySession session = StudySession.builder()
                .id(UUID.randomUUID().toString())
                .userId(user.getId())
                .scope(request.scope())
                .scopeId(request.scopeId())
                .goalId(request.goalId())
                .startedAt(LocalDateTime.now())
                .totalTimeSeconds(0)
                .build();

        StudySession savedSession = studySessionRepository.save(session);
        return mapToDto(savedSession);
    }

    @Override
    @Transactional(readOnly = true)
    public StudySessionDto getSession(String userEmail, String sessionId) {
        User user = getUserByEmail(userEmail);
        StudySession session = studySessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found or access denied"));
        return mapToDto(session);
    }

    @Override
    @Transactional
    public StudySessionDto endSession(String userEmail, String sessionId) {
        User user = getUserByEmail(userEmail);
        StudySession session = studySessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found or access denied"));

        if (session.getCompletedAt() != null) {
            throw new IllegalArgumentException("Session already ended");
        }

        LocalDateTime now = LocalDateTime.now();
        session.setCompletedAt(now);
        session.setTotalTimeSeconds((int) ChronoUnit.SECONDS.between(session.getStartedAt(), now));

        return mapToDto(studySessionRepository.save(session));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudySessionDto> getUserSessions(String userEmail, Pageable pageable) {
        User user = getUserByEmail(userEmail);
        return studySessionRepository.findByUserId(user.getId(), pageable)
                .map(this::mapToDto);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public com.example.backend.dto.study.SummaryDto getSessionSummary(String userEmail, String sessionId, String goalIdStr) {
        return summaryService.getOrCreateSessionSummary(userEmail, sessionId, goalIdStr);
    }

    @Override
    @Transactional
    public java.util.List<com.example.backend.dto.study.FlashcardDto> getSessionFlashcards(String userEmail, String sessionId) {
        return flashcardService.getOrGenerateFlashcards(userEmail, sessionId);
    }

    @Override
    @Transactional
    public com.example.backend.dto.study.QuizDto getSessionQuiz(String userEmail, String sessionId, String cognitiveLevel) {
        // cognitiveLevel isn't fully wired into existing getQuizBySession yet, but we map it if necessary 
        // For now getQuizBySession generates if missing.
        return quizService.getQuizBySession(userEmail, sessionId);
    }

    private StudySessionDto mapToDto(StudySession session) {
        return StudySessionDto.builder()
                .id(session.getId())
                .scope(session.getScope())
                .scopeId(session.getScopeId())
                .goalId(session.getGoalId())
                .startedAt(session.getStartedAt())
                .completedAt(session.getCompletedAt())
                .totalTimeSeconds(session.getTotalTimeSeconds())
                .build();
    }
}