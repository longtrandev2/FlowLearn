package com.example.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreadcrumbDto {
    private String id;
    private String name;
}
