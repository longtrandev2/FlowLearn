package com.example.backend.controller.study;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.study.FlashcardDto;
import com.example.backend.dto.study.FlashcardProgressDto;
import com.example.backend.dto.study.ReviewFlashcardRequest;
import com.example.backend.service.study.FlashcardService;
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

@RestController
@RequestMapping("/api/v1/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @GetMapping("/due")
    public ResponseEntity<ApiResponse<Page<FlashcardProgressDto>>> getDueFlashcards(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.getDueFlashcards(authentication.getName(), PageRequest.of(page, size))
        ));
    }

    @PostMapping("/{flashcardId}/reviews")
    public ResponseEntity<ApiResponse<FlashcardProgressDto>> reviewFlashcard(
            Authentication authentication,
            @PathVariable String flashcardId,
            @Valid @RequestBody ReviewFlashcardRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                flashcardService.reviewFlashcard(authentication.getName(), flashcardId, request)
        ));
    }
}