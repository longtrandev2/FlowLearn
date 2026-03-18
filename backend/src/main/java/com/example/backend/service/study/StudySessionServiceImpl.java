package com.example.backend.service.study;

import com.example.backend.dto.study.CreateStudySessionRequest;
import com.example.backend.dto.study.StudySessionDto;
import com.example.backend.entity.StudySession;
import com.example.backend.entity.User;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.FolderRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.UserRepository;
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
    private final FolderRepository folderRepository;

    @Override
    @Transactional
    public StudySessionDto createSession(String userEmail, CreateStudySessionRequest request) {
        User user = getUserByEmail(userEmail);

        // Validate scope ownership to prevent IDOR
        switch (request.scope()) {
            case FILE:
                documentRepository.findByIdAndUserId(request.scopeId(), user.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Document not found or access denied"));
                break;
            case FOLDER:
                folderRepository.findByIdAndUserId(request.scopeId(), user.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Folder not found or access denied"));
                break;
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