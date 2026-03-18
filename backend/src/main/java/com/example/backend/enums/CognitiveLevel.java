package com.example.backend.enums;

import lombok.Getter;

@Getter
public enum CognitiveLevel {
    RECALL("recall"),
    UNDERSTAND("understand"),
    APPLY("apply");

    private final String value;

    CognitiveLevel(String value) {
        this.value = value;
    }

    public static CognitiveLevel fromValue(String value) {
        for (CognitiveLevel level : CognitiveLevel.values()) {
            if (level.value.equals(value)) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown CognitiveLevel value: " + value);
    }
}
