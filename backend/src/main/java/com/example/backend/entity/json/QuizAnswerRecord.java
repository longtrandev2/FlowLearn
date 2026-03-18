package com.example.backend.entity.json;

import com.example.backend.enums.QuizOptionKey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAnswerRecord implements Serializable {
    private String questionId;
    private QuizOptionKey selectedKey;
    private boolean isCorrect;
}