package com.example.backend.service.study;

import com.example.backend.dto.study.SummaryDto;

public interface SummaryService {
    SummaryDto getSessionSummary(String userEmail, String sessionId);
    SummaryDto generateSessionSummary(String userEmail, String sessionId, String goalId);
}