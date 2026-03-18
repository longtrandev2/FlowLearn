package com.example.backend.entity.converter;

import com.example.backend.enums.StudyScope;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class StudyScopeConverter implements AttributeConverter<StudyScope, String> {

    @Override
    public String convertToDatabaseColumn(final StudyScope attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public StudyScope convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : StudyScope.fromValue(dbData);
    }
}
