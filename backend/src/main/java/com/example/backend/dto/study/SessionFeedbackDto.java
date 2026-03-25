package com.example.backend.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionFeedbackDto {
    private String id;
    private String studySessionId;
    private List<String> weakAreas;
    private String suggestedFocus;
    private Integer overallScore;
    private LocalDateTime createdAt;
}