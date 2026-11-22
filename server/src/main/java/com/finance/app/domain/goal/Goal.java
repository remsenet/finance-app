package com.finance.app.domain.goal;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "goal_name", nullable = false, length = 100)
    private String goalName;

    @Column(name = "target_amount", nullable = false)
    private Long targetAmount;

    @Column(name = "current_seed", nullable = false)
    @Builder.Default
    private Long currentSeed = 0L;

    @Column(name = "monthly_contribution", nullable = false)
    @Builder.Default
    private Long monthlyContribution = 0L;

    @Column(name = "expected_return_rate", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal expectedReturnRate = new BigDecimal("6.00");

    @Column(name = "duration_years", nullable = false)
    @Builder.Default
    private Integer durationYears = 5;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
