package com.example.backend.controller.library;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.document.DocumentDto;
import com.example.backend.dto.document.UpdateDocumentRequest;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.library.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) String folderId,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        DocumentDto document = documentService.uploadDocument(userId, folderId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(document));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getDocuments(
            @RequestParam(value = "folderId", required = false) String folderId,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocumentsInFolder(userId, folderId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> getDocument(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocument(userId, id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> updateDocument(
            @PathVariable String id,
            @Valid @RequestBody UpdateDocumentRequest request,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(documentService.updateDocument(userId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        documentService.deleteDocument(userId, id);
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                .getId();
    }
}
