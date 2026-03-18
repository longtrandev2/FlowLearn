package com.example.backend.repository;

import com.example.backend.entity.StudySession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, String> {
    Page<StudySession> findByUserId(String userId, Pageable pageable);
    Optional<StudySession> findByIdAndUserId(String id, String userId);
    long countByUserId(String userId);
}
