package com.example.backend.dto.study;

import com.example.backend.enums.GoalId;
import com.example.backend.enums.StudyScope;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
@Schema(description = "Request payload to create a new study session")
public record CreateStudySessionRequest(
        @NotNull(message = "Scope is required")
        @Schema(description = "Scope of the study session (only FILE is supported currently)", example = "file", allowableValues = {"file"})
        StudyScope scope,

        @NotBlank(message = "Scope ID is required")
        @Schema(description = "The UUID of the target document file to study", example = "550e8400-e29b-41d4-a716-446655440000")
        String scopeId,

        @NotNull(message = "Goal ID is required")
        @Schema(description = "The learning goal for this session", example = "deep-understanding")
        GoalId goalId
) {}