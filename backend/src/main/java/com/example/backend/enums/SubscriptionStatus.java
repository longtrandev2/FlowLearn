package com.example.backend.enums;

import java.util.Arrays;

public enum SubscriptionStatus {
    ACTIVE("active"),
    CANCELED("canceled"),
    PAST_DUE("past_due"),
    EXPIRED("expired");

    private final String value;

    SubscriptionStatus(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static SubscriptionStatus fromValue(final String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown SubscriptionStatus value: " + value));
    }
}
