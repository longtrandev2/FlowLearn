package com.example.backend.repository;

import com.example.backend.entity.SessionFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionFeedbackRepository extends JpaRepository<SessionFeedback, String> {
    Optional<SessionFeedback> findByStudySessionId(String studySessionId);
}