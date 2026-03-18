package com.example.backend.entity.converter;

import com.example.backend.enums.FlashcardImportance;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class FlashcardImportanceConverter implements AttributeConverter<FlashcardImportance, String> {

    @Override
    public String convertToDatabaseColumn(final FlashcardImportance attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public FlashcardImportance convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : FlashcardImportance.fromValue(dbData);
    }
}
