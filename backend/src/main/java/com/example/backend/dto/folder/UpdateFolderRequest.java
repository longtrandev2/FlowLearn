package com.example.backend.dto.folder;

import com.example.backend.enums.FolderColor;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateFolderRequest {
    @NotBlank(message = "Folder name is required")
    private String name;
    
    private String description;
    private FolderColor color;
}
