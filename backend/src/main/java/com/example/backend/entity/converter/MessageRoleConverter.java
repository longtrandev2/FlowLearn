package com.example.backend.entity.converter;

import com.example.backend.enums.MessageRole;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class MessageRoleConverter implements AttributeConverter<MessageRole, String> {

    @Override
    public String convertToDatabaseColumn(final MessageRole attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public MessageRole convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : MessageRole.fromValue(dbData);
    }
}
