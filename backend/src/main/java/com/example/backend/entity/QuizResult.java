package com.example.backend.entity;

import com.example.backend.entity.converter.QuizAnswersConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "quiz_results", indexes = {
        @Index(name = "idx_quiz_id", columnList = "quiz_id"),
        @Index(name = "idx_user_id", columnList = "user_id")
})
@EntityListeners(AuditingEntityListener.class)
public class QuizResult {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "quiz_id", length = 36, nullable = false)
    private String quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", insertable = false, updatable = false)
    private Quiz quiz;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount;

    @Column(name = "time_spent_seconds", nullable = false)
    private Integer timeSpentSeconds;

    @Convert(converter = QuizAnswersConverter.class)
    @Column(nullable = false, columnDefinition = "JSON")
    private List<Map<String, Object>> answers;

    @CreatedDate
    @Column(name = "completed_at", nullable = false, updatable = false)
    private LocalDateTime completedAt;
}
