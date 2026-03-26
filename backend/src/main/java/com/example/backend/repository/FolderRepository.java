package com.example.backend.repository;

import com.example.backend.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, String> {

    List<Folder> findByUserIdAndParentIdIsNullOrderByCreatedAtDesc(String userId);

    org.springframework.data.domain.Page<Folder> findByUserIdAndParentIdIsNull(String userId, org.springframework.data.domain.Pageable pageable);

    List<Folder> findByUserIdAndParentIdOrderByCreatedAtDesc(String userId, String parentId);

    Optional<Folder> findByIdAndUserId(String id, String userId);

    @Query("SELECT f FROM Folder f WHERE f.userId = :userId AND f.parentId = :parentId AND f.name = :name")
    Optional<Folder> findByUserIdAndParentIdAndName(@Param("userId") String userId, @Param("parentId") String parentId, @Param("name") String name);
    
    @Query("SELECT f FROM Folder f WHERE f.userId = :userId AND f.parentId IS NULL AND f.name = :name")
    Optional<Folder> findByUserIdAndParentIdIsNullAndName(@Param("userId") String userId, @Param("name") String name);

    long countByUserId(String userId);

    long countByParentId(String parentId);
}

