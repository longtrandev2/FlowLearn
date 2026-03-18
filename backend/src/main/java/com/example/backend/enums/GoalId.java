package com.example.backend.enums;

import lombok.Getter;

@Getter
public enum GoalId {
    EXAM_PREP("exam-prep"),
    DEEP_UNDERSTANDING("deep-understanding"),
    QUICK_REVIEW("quick-review"),
    ELI5("eli5"),
    MEMORIZE("memorize");

    private final String value;

    GoalId(String value) {
        this.value = value;
    }

    public static GoalId fromValue(String value) {
        for (GoalId goal : GoalId.values()) {
            if (goal.value.equals(value)) {
                return goal;
            }
        }
        throw new IllegalArgumentException("Unknown GoalId value: " + value);
    }
}
