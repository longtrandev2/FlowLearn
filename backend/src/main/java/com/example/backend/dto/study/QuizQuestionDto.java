package com.example.backend.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestionDto {
    private String id;
    private String question;
    private Map<String, String> options;
    private Integer questionIndex;
}