package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.dto.UpdateRoleRequest;
import com.example.backend.dto.UpdatePlanRequest;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.entity.UserStatus;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(String search, UserRole role, UserStatus status, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate emailPredicate = cb.like(cb.lower(root.get("email")), searchPattern);
                Predicate namePredicate = cb.like(cb.lower(root.get("fullName")), searchPattern);
                predicates.add(cb.or(emailPredicate, namePredicate));
            }

            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(String id) {
        User user = getUserEntity(id);
        return mapToDto(user);
    }

    @Transactional
    public UserDto updateRole(String id, UpdateRoleRequest request) {
        User user = getUserEntity(id);
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto warnUser(String id) {
        User user = getUserEntity(id);
        user.setWarningCount(user.getWarningCount() + 1);
        user.setStatus(UserStatus.WARNED);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto banUser(String id) {
        User user = getUserEntity(id);
        user.setStatus(UserStatus.BANNED);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto unbanUser(String id) {
        User user = getUserEntity(id);
        user.setStatus(UserStatus.ACTIVE);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto suspendUser(String id) {
        User user = getUserEntity(id);
        user.setStatus(UserStatus.SUSPENDED);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updatePlan(String id, UpdatePlanRequest request) {
        User user = getUserEntity(id);
        if (request.getPlan() != null) {
            user.setPlan(request.getPlan());
        }
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private User getUserEntity(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
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
