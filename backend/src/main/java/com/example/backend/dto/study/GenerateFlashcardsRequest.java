package com.example.backend.dto.study;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class GenerateFlashcardsRequest {
    @Schema(description = "Số lượng flashcard cần tạo", defaultValue = "10", example = "10")
    @Min(1)
    @Max(50)
    private Integer quantity = 10;
}
