package com.example.backend.repository;

import com.example.backend.entity.Summary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, String> {
    Page<Summary> findByStudySessionId(String studySessionId, Pageable pageable);
    
    // Validate ownership via joined table
    Optional<Summary> findByIdAndStudySessionUserId(String id, String userId);
}
