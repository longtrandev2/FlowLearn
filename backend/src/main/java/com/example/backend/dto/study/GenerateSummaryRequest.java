package com.example.backend.dto.study;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class GenerateSummaryRequest {
    @Schema(description = "Override mục tiêu học tập (goalId)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String goalId;
}
