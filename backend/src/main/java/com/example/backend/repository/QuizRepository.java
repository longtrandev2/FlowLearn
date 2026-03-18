package com.example.backend.repository;

import com.example.backend.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, String> {
    Page<Quiz> findByStudySessionId(String studySessionId, Pageable pageable);
    
    // Authorization check
    Optional<Quiz> findByIdAndStudySessionUserId(String id, String userId);
}
