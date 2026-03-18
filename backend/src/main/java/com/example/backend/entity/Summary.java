package com.example.backend.entity;

import com.example.backend.entity.converter.GoalIdConverter;
import com.example.backend.enums.GoalId;
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

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "summaries", indexes = {
        @Index(name = "idx_study_session_id", columnList = "study_session_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Summary {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "study_session_id", length = 36, nullable = false)
    private String studySessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_session_id", insertable = false, updatable = false)
    private StudySession studySession;

    @Convert(converter = GoalIdConverter.class)
    @Column(name = "goal_id", nullable = false, length = 64)
    private GoalId goalId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "word_count")
    private Integer wordCount;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
