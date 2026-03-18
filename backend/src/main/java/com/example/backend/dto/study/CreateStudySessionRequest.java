package com.example.backend.dto.study;

import com.example.backend.enums.GoalId;
import com.example.backend.enums.StudyScope;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateStudySessionRequest(
        @NotNull(message = "Scope is required")
        StudyScope scope,
        
        @NotBlank(message = "Scope ID is required")
        String scopeId,
        
        @NotNull(message = "Goal ID is required")
        GoalId goalId
) {}