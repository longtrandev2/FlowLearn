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
public class CreateFolderRequest {
    @NotBlank(message = "Folder name is required")
    private String name;
    
    private String description;
    private String parentId;
    
    @Builder.Default
    private FolderColor color = FolderColor.OCEAN;
}
