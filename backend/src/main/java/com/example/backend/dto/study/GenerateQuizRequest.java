package com.example.backend.dto.study;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class GenerateQuizRequest {
    @Schema(description = "Số lượng câu hỏi trắc nghiệm cần tạo", defaultValue = "10", example = "10")
    @Min(1)
    @Max(50)
    private Integer quantity = 10;

    @Schema(description = "Mức độ nhận thức (cognitive level)", defaultValue = "understand", example = "understand")
    private String cognitiveLevel = "understand";
}
