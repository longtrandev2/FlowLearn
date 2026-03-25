package com.example.backend.controller.study;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.study.QuizDto;
import com.example.backend.dto.study.QuizResultDto;
import com.example.backend.dto.study.SubmitQuizRequest;
import com.example.backend.service.study.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Quizzes", description = "Operations for quizzes and quiz results")
@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @Operation(summary = "Get quiz by session", description = "Retrieve a quiz associated with a specific study session.")
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ApiResponse<QuizDto>> getQuizBySession(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The study session ID") @PathVariable String sessionId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.getQuizBySession(authentication.getName(), sessionId)
        ));
    }

    @Operation(summary = "Submit a quiz", description = "Submit answers for a quiz and get the results.")
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitQuiz(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The ID of the quiz") @PathVariable String quizId,
            @Valid @RequestBody SubmitQuizRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.submitQuizResult(authentication.getName(), quizId, request)
        ));
    }

    @Operation(summary = "Get quiz result", description = "Retrieve a specific historical quiz result.")
    @GetMapping("/results/{resultId}")
    public ResponseEntity<ApiResponse<QuizResultDto>> getQuizResult(
            @Parameter(hidden = true) Authentication authentication,
            @Parameter(description = "The ID of the quiz result") @PathVariable String resultId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                quizService.getQuizResult(authentication.getName(), resultId)
        ));
    }
}