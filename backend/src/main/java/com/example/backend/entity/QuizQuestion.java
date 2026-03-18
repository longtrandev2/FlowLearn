package com.example.backend.entity;

import com.example.backend.entity.converter.QuizOptionsConverter;
import com.example.backend.enums.QuizOptionKey;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "quiz_questions", indexes = {
        @Index(name = "idx_quiz_id", columnList = "quiz_id")
})
public class QuizQuestion {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "quiz_id", length = 36, nullable = false)
    private String quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", insertable = false, updatable = false)
    private Quiz quiz;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Convert(converter = QuizOptionsConverter.class)
    @Column(nullable = false, columnDefinition = "JSON")
    private Map<String, String> options;

    @Enumerated(EnumType.STRING)
    @Column(name = "correct_key", nullable = false, length = 1)
    private QuizOptionKey correctKey;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "question_index", nullable = false)
    private Integer questionIndex;
}
