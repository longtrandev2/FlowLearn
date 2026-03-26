package com.example.backend.repository;

import com.example.backend.entity.Flashcard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, String> {
    Page<Flashcard> findByStudySessionId(String studySessionId, Pageable pageable);
    List<Flashcard> findByDocumentId(String documentId);

    long countByStudySessionUserId(String userId);

    // Find directly by joined study session user
    Optional<Flashcard> findByIdAndStudySessionUserId(String id, String userId);
}
