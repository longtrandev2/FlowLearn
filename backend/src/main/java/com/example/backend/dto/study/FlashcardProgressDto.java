package com.example.backend.dto.study;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class FlashcardProgressDto {
    private String flashcardId;
    private Integer repetitions;
    private Integer intervalDays;
    private BigDecimal easeFactor;
    private LocalDate nextReviewDate;
    private LocalDateTime lastReviewedAt;
    private Integer lastQuality;
    private FlashcardDto flashcard;
}