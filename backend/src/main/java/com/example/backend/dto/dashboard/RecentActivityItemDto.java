package com.example.backend.dto.dashboard;

import java.time.LocalDateTime;

public record RecentActivityItemDto(
        String id,
        String type, // "study_session", "quiz_complete", "document_upload"
        String title,
        Integer value, // duration for study, score for quiz, null for doc
        String unit, // "mins", "%", null
        LocalDateTime completedAt
) {
}