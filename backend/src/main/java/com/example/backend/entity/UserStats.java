package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_stats")
@EntityListeners(AuditingEntityListener.class)
public class UserStats {

    @Id
    @Column(name = "user_id", length = 36)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "documents_count", nullable = false)
    @Builder.Default
    private Integer documentsCount = 0;

    @Column(name = "folders_count", nullable = false)
    @Builder.Default
    private Integer foldersCount = 0;

    @Column(name = "flashcards_count", nullable = false)
    @Builder.Default
    private Integer flashcardsCount = 0;

    @Column(name = "study_sessions_count", nullable = false)
    @Builder.Default
    private Integer studySessionsCount = 0;

    @Column(name = "current_streak", nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    @Builder.Default
    private Integer longestStreak = 0;

    @Column(name = "total_study_hours", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalStudyHours = BigDecimal.ZERO;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
