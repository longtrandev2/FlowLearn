package com.example.backend.repository;

import com.example.backend.entity.QuizResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, String> {
    Page<QuizResult> findByUserId(String userId, Pageable pageable);
    Page<QuizResult> findByQuizId(String quizId, Pageable pageable);
    Optional<QuizResult> findByIdAndUserId(String id, String userId);
}
