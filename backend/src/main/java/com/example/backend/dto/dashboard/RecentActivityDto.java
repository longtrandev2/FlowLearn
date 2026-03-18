package com.example.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityDto {
    private String type; // "study_session", "quiz", "flashcard_review"
    private String id;
    private String title;
    private String goal;
    private Long score; // Or progress percentage 
    private Integer timeSpentSeconds; // Optional
    private String timeAgo; // e.g. "2 hours ago"
}