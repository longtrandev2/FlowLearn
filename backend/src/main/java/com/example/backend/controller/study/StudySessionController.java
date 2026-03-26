package com.example.backend.controller.study;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.study.CreateStudySessionRequest;
import com.example.backend.dto.study.StudySessionDto;
import com.example.backend.dto.study.SummaryDto;
import com.example.backend.dto.study.SessionFeedbackDto;
import com.example.backend.dto.study.FlashcardDto;
import com.example.backend.dto.study.QuizDto;
import java.util.List;
import com.example.backend.dto.study.GenerateFlashcardsRequest;
import com.example.backend.dto.study.GenerateQuizRequest;
import com.example.backend.dto.study.GenerateSummaryRequest;
import com.example.backend.service.study.FlashcardService;
import com.example.backend.service.study.QuizService;

import com.example.backend.service.study.StudySessionService;
import com.example.backend.service.study.SummaryService;
import com.example.backend.service.study.SessionFeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Study Session", description = "Operations for study sessions (flashcards, quizzes)")
@RestController
@RequestMapping("/api/v1/study-sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService studySessionService;
    private final SummaryService summaryService;
    private final SessionFeedbackService sessionFeedbackService;
    private final FlashcardService flashcardService;
    private final QuizService quizService;

    @Operation(summary = "Create a study session", description = "Create a new learning session for a specific target element.")
    @PostMapping
    public ResponseEntity<ApiResponse<StudySessionDto>> createSession(
            @Parameter(hidden = true) Authentication authentication,
            @Valid @RequestBody CreateStudySessionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.createSession(authentication.getName(), request)
        ));
    }

    @Operation(summary = "Get user study sessions", description = "Retrieve a paginated list of all study sessions for the authenticated user.")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudySessionDto>>> getUserSessions(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.getUserSessions(authentication.getName(), PageRequest.of(page, size))
        ));
    }

    @Operation(summary = "Get a specific session", description = "Retrieve details by a specific study session ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudySessionDto>> getSession(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The ID of the session") @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.getSession(authentication.getName(), id)
        ));
    }

    @Operation(summary = "End a study session", description = "Marks an active study session as ended and records completion time.")
    @PutMapping("/{id}/end")
    public ResponseEntity<ApiResponse<StudySessionDto>> endSession(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID to end") @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.endSession(authentication.getName(), id)
        ));
    }

    @Operation(summary = "Get session summary", description = "Get existing summary for the study session.")
    @GetMapping("/{id}/summary")
    public ResponseEntity<ApiResponse<SummaryDto>> getSessionSummary(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                summaryService.getSessionSummary(authentication.getName(), id)
        ));
    }

    @Operation(summary = "Generate session summary", description = "Generate AI summary for the study session based on pre-study materials.")
    @PostMapping("/{id}/summary/generate")
    public ResponseEntity<ApiResponse<SummaryDto>> generateSessionSummary(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id,
            @Valid @RequestBody GenerateSummaryRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                summaryService.generateSessionSummary(authentication.getName(), id, request.getGoalId())
        ));
    }

    @Operation(summary = "Get session feedback", description = "Get AI-generated evaluation for a completed study session based on quiz and flashcard performance.")
    @GetMapping("/{id}/feedback")
    public ResponseEntity<ApiResponse<SessionFeedbackDto>> getSessionFeedback(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                sessionFeedbackService.getOrGenerateFeedback(authentication.getName(), id)
        ));
    }

    @Operation(summary = "Get session flashcards", description = "Get flashcards for the study session.")
    @GetMapping("/{id}/flashcards")
    public ResponseEntity<ApiResponse<Page<FlashcardDto>>> getSessionFlashcards(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.getFlashcardsBySession(authentication.getName(), id, PageRequest.of(page, size))
        ));
    }

    @Operation(summary = "Generate session flashcards", description = "Generate AI flashcards for the study session.")
    @PostMapping("/{id}/flashcards/generate")
    public ResponseEntity<ApiResponse<List<FlashcardDto>>> generateSessionFlashcards(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id,
            @Valid @RequestBody GenerateFlashcardsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.generateFlashcards(authentication.getName(), id, request.getQuantity())
        ));
    }

    @Operation(summary = "Get session quiz", description = "Get existing quiz for the study session.")
    @GetMapping("/{id}/quiz")
    public ResponseEntity<ApiResponse<QuizDto>> getSessionQuiz(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.getQuizBySession(authentication.getName(), id)
        ));
    }

    @Operation(summary = "Generate session quiz", description = "Generate AI quiz for the study session.")
    @PostMapping("/{id}/quiz/generate")
    public ResponseEntity<ApiResponse<QuizDto>> generateSessionQuiz(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The session ID") @PathVariable String id,
            @Valid @RequestBody GenerateQuizRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.generateQuizForSession(authentication.getName(), id, request.getQuantity(), request.getCognitiveLevel())
        ));
    }
}







