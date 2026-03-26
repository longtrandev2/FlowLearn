package com.example.backend.dto.study;

import com.example.backend.enums.GoalId;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StudySessionDto {
    private String id;
    private String fileId;
    private GoalId goalId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer totalTimeSeconds;
}