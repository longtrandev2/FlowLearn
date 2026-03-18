package com.example.backend.entity;

import com.example.backend.entity.converter.FlashcardImportanceConverter;
import com.example.backend.enums.FlashcardImportance;
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
@Table(name = "flashcards", indexes = {
        @Index(name = "idx_document_id", columnList = "document_id"),
        @Index(name = "idx_study_session_id", columnList = "study_session_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Flashcard {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "document_id", length = 36)
    private String documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", insertable = false, updatable = false)
    private Document document;

    @Column(name = "study_session_id", length = 36)
    private String studySessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_session_id", insertable = false, updatable = false)
    private StudySession studySession;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String front;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String back;

    @Convert(converter = FlashcardImportanceConverter.class)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private FlashcardImportance importance = FlashcardImportance.CORE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
