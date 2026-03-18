package com.example.backend.entity.converter;

import com.example.backend.enums.SubscriptionStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class SubscriptionStatusConverter implements AttributeConverter<SubscriptionStatus, String> {

    @Override
    public String convertToDatabaseColumn(final SubscriptionStatus attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public SubscriptionStatus convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : SubscriptionStatus.fromValue(dbData);
    }
}
