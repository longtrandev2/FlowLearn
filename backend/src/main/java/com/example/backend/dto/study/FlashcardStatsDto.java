package com.example.backend.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardStatsDto {
    private Long totalCards;
    private Long cardsReviewed;
    private Long cardsDueToday;
    private Long cardsLearned;
    private Double averageEaseFactor;
    private Double retentionRate;
}