package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    @Transactional
    public UserDto updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getPlan() != null) user.setPlan(request.getPlan());
        if (request.getStorageLimitMb() != null) user.setStorageLimitMb(request.getStorageLimitMb());
        if (request.getWarningCount() != null) user.setWarningCount(request.getWarningCount());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .status(user.getStatus())
                .plan(user.getPlan())
                .storageUsedMb(user.getStorageUsedMb())
                .storageLimitMb(user.getStorageLimitMb())
                .warningCount(user.getWarningCount())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
