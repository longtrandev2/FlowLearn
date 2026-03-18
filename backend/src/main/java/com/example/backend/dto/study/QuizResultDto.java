package com.example.backend.dto.study;

import com.example.backend.entity.json.QuizAnswerRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultDto {
    private String id;
    private String quizId;
    private BigDecimal score;
    private Integer correctCount;
    private Integer timeSpentSeconds;
    private List<QuizAnswerRecord> answers;
    private LocalDateTime completedAt;
}