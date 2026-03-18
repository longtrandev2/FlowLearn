package com.example.backend.entity.converter;

import com.example.backend.enums.FolderColor;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class FolderColorConverter implements AttributeConverter<FolderColor, String> {

    @Override
    public String convertToDatabaseColumn(final FolderColor attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public FolderColor convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : FolderColor.fromValue(dbData);
    }
}
