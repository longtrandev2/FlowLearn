package com.example.backend.dto.study;

import com.example.backend.enums.QuizOptionKey;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitQuizRequest {
    
    @NotNull(message = "Time spent is required")
    private Integer timeSpentSeconds;

    @NotEmpty(message = "Answers map cannot be empty")
    private List<SubmitQuizAnswer> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitQuizAnswer {
        @NotNull(message = "Question ID is required")
        private String questionId;
        
        @NotNull(message = "Selected option is required")
        private QuizOptionKey selectedKey;
    }
}