package com.example.backend.dto.study;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ReviewFlashcardRequest(
        @NotNull(message = "Quality is required")
        @Min(value = 0, message = "Quality must be at least 0")
        @Max(value = 5, message = "Quality cannot exceed 5")
        Integer quality
) {}