package com.example.backend.dto.study;

import com.example.backend.enums.GoalId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummaryDto {
    private String id;
    private String studySessionId;
    private GoalId goalId;
    private String content;
    private Integer wordCount;
    private LocalDateTime createdAt;
}