package com.example.backend.repository;

import com.example.backend.entity.UserFlashcardProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserFlashcardProgressRepository extends JpaRepository<UserFlashcardProgress, String> {
    Optional<UserFlashcardProgress> findByUserIdAndFlashcardId(String userId, String flashcardId);
    
    // Find all flashcards due for review for a user up to today
    @Query("SELECT p FROM UserFlashcardProgress p WHERE p.userId = :userId AND (p.nextReviewDate IS NULL OR p.nextReviewDate <= :today)")
    List<UserFlashcardProgress> findDueForReview(String userId, LocalDate today);
    
    @Query("SELECT COUNT(p) FROM UserFlashcardProgress p WHERE p.userId = :userId AND (p.nextReviewDate IS NULL OR p.nextReviewDate <= :today)")
    long countDueByUserId(String userId, LocalDate today);

    long countByUserId(String userId);

    @Query("SELECT COUNT(p) FROM UserFlashcardProgress p WHERE p.userId = :userId AND p.repetitions > 0")
    long countReviewedByUserId(String userId);

    @Query("SELECT COUNT(p) FROM UserFlashcardProgress p WHERE p.userId = :userId AND p.intervalDays > 21")
    long countLearnedByUserId(String userId);

    @Query("SELECT AVG(p.easeFactor) FROM UserFlashcardProgress p WHERE p.userId = :userId AND p.repetitions > 0")
    Double getAverageEaseFactor(String userId);
    
    Page<UserFlashcardProgress> findByUserId(String userId, Pageable pageable);
}
