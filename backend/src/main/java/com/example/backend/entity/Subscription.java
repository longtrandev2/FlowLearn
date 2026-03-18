package com.example.backend.entity;

import com.example.backend.entity.converter.SubscriptionStatusConverter;
import com.example.backend.enums.SubscriptionStatus;
import com.example.backend.enums.UserPlan;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "subscriptions", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_stripe_subscription", columnList = "stripe_subscription_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Subscription {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserPlan plan;

    @Convert(converter = SubscriptionStatusConverter.class)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(name = "stripe_subscription_id", length = 255)
    private String stripeSubscriptionId;

    @Column(name = "stripe_customer_id", length = 255)
    private String stripeCustomerId;

    @Column(name = "current_period_start")
    private LocalDateTime currentPeriodStart;

    @Column(name = "current_period_end")
    private LocalDateTime currentPeriodEnd;

    @Column(name = "cancel_at_period_end", nullable = false)
    @Builder.Default
    private Boolean cancelAtPeriodEnd = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
