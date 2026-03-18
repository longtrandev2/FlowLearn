package com.example.backend.repository;

import com.example.backend.entity.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, String> {
    Optional<UserStats> findByUserId(String userId);
}