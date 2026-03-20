package com.example.backend.controller.study;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.study.CreateStudySessionRequest;
import com.example.backend.dto.study.StudySessionDto;
import com.example.backend.dto.study.FlashcardDto;
import com.example.backend.dto.study.QuizDto;
import com.example.backend.service.study.StudySessionService;
import com.example.backend.service.study.FlashcardService;
import com.example.backend.service.study.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/study-sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService studySessionService;
    private final FlashcardService flashcardService;
    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<ApiResponse<StudySessionDto>> createSession(
            Authentication authentication,
            @Valid @RequestBody CreateStudySessionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.createSession(authentication.getName(), request)
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudySessionDto>>> getUserSessions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.getUserSessions(authentication.getName(), PageRequest.of(page, size))
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudySessionDto>> getSession(
            Authentication authentication,
            @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                studySessionService.getSession(authentication.getName(), id)
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<StudySessionDto>> updateSessionStatus(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody com.example.backend.dto.study.UpdateSessionStatusRequest request
    ) {
        if ("ENDED".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity.ok(ApiResponse.success(
                    studySessionService.endSession(authentication.getName(), id)
            ));
        }
        // Future expansions for other statuses can be handled here
        return ResponseEntity.badRequest().body(ApiResponse.error(new com.example.backend.dto.ApiError("INVALID_STATUS", "Only 'ENDED' status is currently supported for updates.", null)));
    }

    @GetMapping("/{id}/flashcards")
    public ResponseEntity<ApiResponse<Page<FlashcardDto>>> getSessionFlashcards(
            Authentication authentication,
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.getFlashcardsBySession(authentication.getName(), id, PageRequest.of(page, size))
        ));
    }

    @GetMapping("/{id}/quizzes")
    public ResponseEntity<ApiResponse<QuizDto>> getSessionQuizzes(
            Authentication authentication,
            @PathVariable String id
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.getQuizBySession(authentication.getName(), id)
        ));
    }
}