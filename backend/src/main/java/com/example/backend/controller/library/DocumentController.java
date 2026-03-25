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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.MediaType;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "docx", "doc", "txt");

    @Operation(summary = "Upload a document", description = "Uploads a new document to the specified folder. Allowed formats: .pdf, .docx, .doc, .txt. Max size: 10MB.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Document uploaded successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file format or bad request", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "413", description = "File size exceeds 10MB limit", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @Parameter(description = "The file to upload") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Optional folder ID to place the file in") @RequestParam(value = "folderId", required = false) String folderId,
            Authentication authentication
    ) {
        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.lastIndexOf(".") != -1) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(ext)) {
                throw new IllegalArgumentException("Invalid file format. Allowed formats: .pdf, .docx, .doc, .txt");
            }
        } else {
            throw new IllegalArgumentException("File must have an extension.");
        }

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
