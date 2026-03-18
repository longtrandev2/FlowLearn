package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_flashcard_progress", uniqueConstraints = {
        @UniqueConstraint(name = "unique_user_flashcard", columnNames = {"user_id", "flashcard_id"})
}, indexes = {
        @Index(name = "idx_user_next_review", columnList = "user_id,next_review_date"),
        @Index(name = "idx_flashcard_id", columnList = "flashcard_id")
})
@EntityListeners(AuditingEntityListener.class)
public class UserFlashcardProgress {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "flashcard_id", length = 36, nullable = false)
    private String flashcardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id", insertable = false, updatable = false)
    private Flashcard flashcard;

    @Column(nullable = false)
    @Builder.Default
    private Integer repetitions = 0;

    @Column(name = "interval_days", nullable = false)
    @Builder.Default
    private Integer intervalDays = 0;

    @Column(name = "ease_factor", precision = 3, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal easeFactor = new BigDecimal("2.50");

    @Column(name = "next_review_date")
    private LocalDate nextReviewDate;

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;

    @Column(name = "last_quality")
    private Integer lastQuality;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
