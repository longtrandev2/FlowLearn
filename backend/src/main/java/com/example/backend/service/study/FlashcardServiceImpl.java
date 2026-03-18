package com.example.backend.service.study;

import com.example.backend.dto.study.FlashcardDto;
import com.example.backend.dto.study.FlashcardProgressDto;
import com.example.backend.dto.study.ReviewFlashcardRequest;
import com.example.backend.entity.Flashcard;
import com.example.backend.entity.User;
import com.example.backend.entity.UserFlashcardProgress;
import com.example.backend.repository.FlashcardRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.UserFlashcardProgressRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlashcardServiceImpl implements FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final UserFlashcardProgressRepository progressRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FlashcardDto> getFlashcardsBySession(String userEmail, String sessionId, Pageable pageable) {
        User user = getUserByEmail(userEmail);
        
        // Ensure user owns the session before fetching flashcards
        studySessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found or access denied"));

        return flashcardRepository.findByStudySessionId(sessionId, pageable)
                .map(this::mapToFlashcardDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FlashcardProgressDto> getDueFlashcards(String userEmail, Pageable pageable) {
        User user = getUserByEmail(userEmail);
        // Note: Using pageable finding all progress entries. 
        // Real implementation usually filters out those with nextReviewDate <= Today
        return progressRepository.findByUserId(user.getId(), pageable)
                .map(this::mapToProgressDto);
    }

    @Override
    @Transactional
    public FlashcardProgressDto reviewFlashcard(String userEmail, String flashcardId, ReviewFlashcardRequest request) {
        User user = getUserByEmail(userEmail);

        // Security Check: Make sure flashcard exists and belongs to the user
        Flashcard flashcard = flashcardRepository.findByIdAndStudySessionUserId(flashcardId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Flashcard not found or access denied"));

        UserFlashcardProgress progress = progressRepository.findByUserIdAndFlashcardId(user.getId(), flashcardId)
                .orElseGet(() -> UserFlashcardProgress.builder()
                        .id(UUID.randomUUID().toString())
                        .userId(user.getId())
                        .flashcardId(flashcardId)
                        .flashcard(flashcard)
                        .repetitions(0)
                        .intervalDays(0)
                        .easeFactor(new BigDecimal("2.50"))
                        .build());

        // Apply SM-2 Algorithm
        int quality = request.quality();
        int repetitions = progress.getRepetitions();
        int intervalDays = progress.getIntervalDays();
        BigDecimal easeFactor = progress.getEaseFactor();

        if (quality >= 3) {
            if (repetitions == 0) {
                intervalDays = 1;
            } else if (repetitions == 1) {
                intervalDays = 6;
            } else {
                intervalDays = (int) Math.round(intervalDays * easeFactor.doubleValue());
            }
            repetitions++;
        } else {
            repetitions = 0;
            intervalDays = 1;
        }

        double newEaseFactorCalc = easeFactor.doubleValue() + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (newEaseFactorCalc < 1.3) {
            newEaseFactorCalc = 1.3;
        }

        progress.setRepetitions(repetitions);
        progress.setIntervalDays(intervalDays);
        progress.setEaseFactor(BigDecimal.valueOf(newEaseFactorCalc).setScale(2, RoundingMode.HALF_UP));
        progress.setLastQuality(quality);
        progress.setLastReviewedAt(LocalDateTime.now());
        progress.setNextReviewDate(LocalDate.now().plusDays(intervalDays));

        return mapToProgressDto(progressRepository.save(progress));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }

    private FlashcardDto mapToFlashcardDto(Flashcard entity) {
        return FlashcardDto.builder()
                .id(entity.getId())
                .documentId(entity.getDocumentId())
                .studySessionId(entity.getStudySessionId())
                .front(entity.getFront())
                .back(entity.getBack())
                .importance(entity.getImportance())
                .build();
    }

    private FlashcardProgressDto mapToProgressDto(UserFlashcardProgress entity) {
        return FlashcardProgressDto.builder()
                .flashcardId(entity.getFlashcardId())
                .repetitions(entity.getRepetitions())
                .intervalDays(entity.getIntervalDays())
                .easeFactor(entity.getEaseFactor())
                .nextReviewDate(entity.getNextReviewDate())
                .lastReviewedAt(entity.getLastReviewedAt())
                .lastQuality(entity.getLastQuality())
                .flashcard(entity.getFlashcard() != null ? mapToFlashcardDto(entity.getFlashcard()) : null)
                .build();
    }
}