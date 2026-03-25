package com.example.backend.controller.study;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.study.FlashcardDto;
import com.example.backend.dto.study.FlashcardProgressDto;
import com.example.backend.dto.study.FlashcardStatsDto;
import com.example.backend.dto.study.ReviewFlashcardRequest;
import com.example.backend.service.study.FlashcardService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Flashcards", description = "Operations for flashcards and spaced repetition")
@RestController
@RequestMapping("/api/v1/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @Operation(summary = "Get flashcards by session", description = "Retrieve a paginated list of flashcards for a specific study session.")
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ApiResponse<Page<FlashcardDto>>> getBySession(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "Study session ID") @PathVariable String sessionId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.getFlashcardsBySession(authentication.getName(), sessionId, PageRequest.of(page, size))
        ));
    }

    @Operation(summary = "Get due flashcards", description = "Retrieve a paginated list of flashcards due for review based on spaced repetition algorithms.")
    @GetMapping("/due")
    public ResponseEntity<ApiResponse<Page<FlashcardProgressDto>>> getDueFlashcards(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.getDueFlashcards(authentication.getName(), PageRequest.of(page, size))
        ));
    }

    @Operation(summary = "Review a flashcard", description = "Submit a review score (1-5) for a flashcard and update its spaced repetition intervals.")
    @PostMapping("/{flashcardId}/review")
    public ResponseEntity<ApiResponse<FlashcardProgressDto>> reviewFlashcard(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The ID of the flashcard to review") @PathVariable String flashcardId,
            @Valid @RequestBody ReviewFlashcardRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.reviewFlashcard(authentication.getName(), flashcardId, request)
        ));
    }

    @Operation(summary = "Get flashcard stats", description = "Get SRS statistics for the user.")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<FlashcardStatsDto>> getFlashcardStats(
            @Parameter(hidden = true) Authentication authentication
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.getFlashcardStats(authentication.getName())
        ));
    }
}