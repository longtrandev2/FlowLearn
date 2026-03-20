package com.example.backend.controller.admin;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.CurrentUserResponse;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<CurrentUserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<CurrentUserResponse> usersPage = userRepository.findAll(PageRequest.of(page, size))
                .map(user -> new CurrentUserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getAvatarUrl(),
                        user.getRole(),
                        user.getStatus(),
                        user.getPlan(),
                        user.getLastLoginAt(),
                        user.getCreatedAt()
                ));
        return ResponseEntity.ok(ApiResponse.success(usersPage));
    }

    @GetMapping("/super")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> superAdminOnly() {
        return ResponseEntity.ok(ApiResponse.success("Only SUPER_ADMIN can see this"));
    }
}