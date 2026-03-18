package com.example.backend.entity.converter;

import com.example.backend.enums.GoalId;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class GoalIdConverter implements AttributeConverter<GoalId, String> {

    @Override
    public String convertToDatabaseColumn(final GoalId attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public GoalId convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : GoalId.fromValue(dbData);
    }
}
