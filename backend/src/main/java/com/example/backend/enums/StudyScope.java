package com.example.backend.enums;

import lombok.Getter;

@Getter
public enum StudyScope {
    FILE("file");

    private final String value;

    StudyScope(String value) {
        this.value = value;
    }

    public static StudyScope fromValue(String value) {
        for (StudyScope scope : StudyScope.values()) {
            if (scope.value.equals(value)) {
                return scope;
            }
        }
        throw new IllegalArgumentException("Unknown StudyScope value: " + value);
    }
}
