package com.example.backend.controller.study;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.study.QuizDto;
import com.example.backend.dto.study.QuizResultDto;
import com.example.backend.dto.study.SubmitQuizRequest;
import com.example.backend.service.study.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ApiResponse<QuizDto>> getQuizBySession(
            Authentication authentication,
            @PathVariable String sessionId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.getQuizBySession(authentication.getName(), sessionId)
        ));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitQuiz(
            Authentication authentication,
            @PathVariable String quizId,
            @Valid @RequestBody SubmitQuizRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.submitQuizResult(authentication.getName(), quizId, request)
        ));
    }

    @GetMapping("/results/{resultId}")
    public ResponseEntity<ApiResponse<QuizResultDto>> getQuizResult(
            Authentication authentication,
            @PathVariable String resultId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.getQuizResult(authentication.getName(), resultId)
        ));
    }
}