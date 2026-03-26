package com.example.backend.repository;

import com.example.backend.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {

    List<Document> findByUserIdAndFolderIdOrderByUploadedAtDesc(String userId, String folderId);

    List<Document> findByUserIdAndFolderIdIsNullOrderByUploadedAtDesc(String userId);

    Page<Document> findByUserIdAndFolderId(String userId, String folderId, Pageable pageable);

    Page<Document> findByUserIdAndFolderIdIsNull(String userId, Pageable pageable);

    Optional<Document> findByIdAndUserId(String id, String userId);

    long countByUserId(String userId);

    long countByFolderId(String folderId);
}
