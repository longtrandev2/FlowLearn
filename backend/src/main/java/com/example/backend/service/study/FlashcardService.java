package com.example.backend.service.study;

import com.example.backend.dto.study.FlashcardDto;
import com.example.backend.dto.study.FlashcardProgressDto;
import com.example.backend.dto.study.ReviewFlashcardRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FlashcardService {
    Page<FlashcardDto> getFlashcardsBySession(String userEmail, String sessionId, Pageable pageable);
    Page<FlashcardProgressDto> getDueFlashcards(String userEmail, Pageable pageable);
    FlashcardProgressDto reviewFlashcard(String userEmail, String flashcardId, ReviewFlashcardRequest request);
    java.util.List<FlashcardDto> getOrGenerateFlashcards(String userEmail, String sessionId);
}