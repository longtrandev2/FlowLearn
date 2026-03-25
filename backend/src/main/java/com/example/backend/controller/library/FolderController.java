package com.example.backend.controller.library;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.folder.CreateFolderRequest;
import com.example.backend.dto.folder.FolderDto;
import com.example.backend.dto.folder.UpdateFolderRequest;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.library.FolderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/folders")
@RequiredArgsConstructor
@Tag(name = "Folder Management", description = "Folder Hierarchy & Directory APIs")
public class FolderController {

    private final FolderService folderService;
    private final UserRepository userRepository;

    @Operation(summary = "Create a folder", description = "Create a new folder or subfolder.")
    @PostMapping
    public ResponseEntity<ApiResponse<FolderDto>> createFolder(
            @Valid @RequestBody CreateFolderRequest request,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        FolderDto folder = folderService.createFolder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(folder));
    }

    @Operation(summary = "List root folders", description = "Get all root level folders for the authenticated user.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<FolderDto>>> getRootFolders(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.getRootFolders(userId)));
    }

    @Operation(summary = "Get folder details", description = "Retrieve details for a specific folder by ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FolderDto>> getFolder(
            @Parameter(description = "The ID of the folder") @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.getFolder(userId, id)));
    }

    @Operation(summary = "Get folder contents", description = "Get all documents and subfolders within a folder, including the breadcrumb trail back to the root.")
    @GetMapping("/{id}/contents")
    public ResponseEntity<ApiResponse<com.example.backend.dto.folder.FolderContentsDto>> getFolderContents(
            @Parameter(description = "The ID of the folder") @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.getFolderContents(userId, id)));
    }

    @Operation(summary = "Update folder details", description = "Update the name, description, or color of an existing folder.")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FolderDto>> updateFolder(
            @Parameter(description = "The ID of the folder to update") @PathVariable String id,
            @Valid @RequestBody UpdateFolderRequest request,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.updateFolder(userId, id, request)));
    }

    @Operation(summary = "Delete a folder", description = "Delete a folder. Note: Folder must be empty of subfolders and documents before deletion.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(
            @Parameter(description = "The ID of the folder to delete") @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        folderService.deleteFolder(userId, id);
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                .getId();
    }
}
