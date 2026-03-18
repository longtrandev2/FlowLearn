package com.example.backend.enums;

import java.util.Arrays;

public enum GoalId {
    EXAM_PREP("exam-prep"),
    DEEP_UNDERSTANDING("deep-understanding"),
    QUICK_REVIEW("quick-review"),
    ELI5("eli5"),
    MEMORIZE("memorize");

    private final String value;

    GoalId(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static GoalId fromValue(final String value) {
        return Arrays.stream(values())
                .filter(goal -> goal.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown GoalId value: " + value));
    }
}
