package com.example.backend.entity;

import com.example.backend.entity.converter.StringListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "session_feedbacks", indexes = {
        @Index(name = "idx_study_session_id", columnList = "study_session_id")
})
@EntityListeners(AuditingEntityListener.class)
public class SessionFeedback {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "study_session_id", length = 36, nullable = false)
    private String studySessionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_session_id", insertable = false, updatable = false)
    private StudySession studySession;

    @Convert(converter = StringListConverter.class)
    @Column(name = "weak_areas", columnDefinition = "JSON")
    private List<String> weakAreas;

    @Column(name = "suggested_focus", columnDefinition = "TEXT")
    private String suggestedFocus;

    @Column(name = "overall_score")
    private Integer overallScore;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}