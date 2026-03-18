package com.example.backend.service.study;

import com.example.backend.dto.study.SummaryDto;
import com.example.backend.entity.Document;
import com.example.backend.entity.StudySession;
import com.example.backend.entity.Summary;
import com.example.backend.entity.User;
import com.example.backend.enums.GoalId;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.SummaryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ai.AiGenerationService;
import com.example.backend.service.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SummaryServiceImpl implements SummaryService {

    private final SummaryRepository summaryRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final AiGenerationService aiGenerationService;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public SummaryDto getOrCreateSessionSummary(String userEmail, String sessionId, String overrideGoalId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        StudySession session = studySessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        // If summary exists, return it
        Optional<Summary> existingSummary = summaryRepository.findFirstByStudySessionIdOrderByCreatedAtDesc(sessionId);
        if (existingSummary.isPresent()) {
            return mapToDto(existingSummary.get());
        }

        // Setup goal
        GoalId goalId = session.getGoalId();
        if (overrideGoalId != null && !overrideGoalId.isEmpty()) {
            try {
                goalId = GoalId.valueOf(overrideGoalId.toUpperCase().replace("-", "_"));
            } catch (Exception e) {
                log.warn("Invalid override goal ID provided: {}", overrideGoalId);
            }
        }

        // Get text
        String text = getSessionTextContent(session);
        
        // Generate with AI
        String content = aiGenerationService.generateSummary(session, text);

        // Save new summary
        Summary summary = Summary.builder()
                .id(UUID.randomUUID().toString())
                .studySessionId(session.getId())
                .goalId(goalId)
                .content(content)
                .wordCount(content != null ? content.split("\\s+").length : 0)
                .createdAt(LocalDateTime.now())
                .build();
                
        summaryRepository.save(summary);
        
        return mapToDto(summary);
    }
    
    private String getSessionTextContent(StudySession session) {
        // Simple case: session scope is FILE
        if (session.getScope() == com.example.backend.enums.StudyScope.FILE) {
            Document doc = documentRepository.findById(session.getScopeId())
                    .orElseThrow(() -> new IllegalArgumentException("Document not found"));
            
            try {
                return fileStorageService.downloadText(doc.getR2Key() + ".txt");
            } catch (Exception e) {
                log.error("Failed to fetch text content for document {}", doc.getId(), e);
                // Fallback or throw error. The user wants gracefulness.
                return "Note: Content could not be extracted or is missing.";
            }
        } else if (session.getScope() == com.example.backend.enums.StudyScope.FOLDER) {
            // Complex case: Folder contains multiple files. For now, merge them.
            // ... (simplifying logic: just fetching the first document or concatenating)
            return "Folder summary logic not fully implemented yet.";
        }
        return "";
    }

    private SummaryDto mapToDto(Summary summary) {
        return SummaryDto.builder()
                .id(summary.getId())
                .studySessionId(summary.getStudySessionId())
                .goalId(summary.getGoalId())
                .content(summary.getContent())
                .wordCount(summary.getWordCount())
                .createdAt(summary.getCreatedAt())
                .build();
    }
}