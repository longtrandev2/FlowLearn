package com.example.backend.service.study;

import com.example.backend.dto.study.SummaryDto;

public interface SummaryService {
    SummaryDto getOrCreateSessionSummary(String userEmail, String sessionId, String goalId);
}