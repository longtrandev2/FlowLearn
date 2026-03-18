package com.example.backend.dto.study;

import com.example.backend.enums.GoalId;
import com.example.backend.enums.StudyScope;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StudySessionDto {
    private String id;
    private StudyScope scope;
    private String scopeId;
    private GoalId goalId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer totalTimeSeconds;
}