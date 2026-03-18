package com.example.backend.dto.study;

import com.example.backend.enums.CognitiveLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDto {
    private String id;
    private String studySessionId;
    private CognitiveLevel cognitiveLevel;
    private Integer totalQuestions;
    private List<QuizQuestionDto> questions;
    private LocalDateTime createdAt;
}