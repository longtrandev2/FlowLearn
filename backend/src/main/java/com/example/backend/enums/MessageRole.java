package com.example.backend.enums;

import java.util.Arrays;

public enum MessageRole {
    USER("user"),
    MODEL("model");

    private final String value;

    MessageRole(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static MessageRole fromValue(final String value) {
        return Arrays.stream(values())
                .filter(role -> role.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown MessageRole value: " + value));
    }
}
