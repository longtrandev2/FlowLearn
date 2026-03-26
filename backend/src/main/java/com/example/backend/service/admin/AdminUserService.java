package com.example.backend.service.admin;

import com.example.backend.dto.admin.UpdateUserRoleRequest;
import com.example.backend.dto.admin.UpdateUserStatusRequest;
import com.example.backend.dto.admin.UserAdminDto;
import com.example.backend.entity.User;
import com.example.backend.enums.UserStatus;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public Page<UserAdminDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    public UserAdminDto updateUserStatus(String id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setStatus(request.status());
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserAdminDto warnUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                
        user.setWarningCount(user.getWarningCount() + 1);
        
        if (user.getWarningCount() >= 3) {
            user.setStatus(UserStatus.SUSPENDED);
        }
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserAdminDto updateUserRole(String id, UpdateUserRoleRequest request) {
         User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                
        user.setRole(request.role());
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    private UserAdminDto mapToDto(User user) {
        return new UserAdminDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus(),
                user.getPlan(),
                user.getStorageUsedMb(),
                user.getStorageLimitMb(),
                user.getWarningCount(),
                user.getLastLoginAt(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}