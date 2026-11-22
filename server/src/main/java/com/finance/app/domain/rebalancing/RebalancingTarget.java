package com.finance.app.domain.rebalancing;

import com.finance.app.domain.asset.AssetType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "rebalancing_targets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RebalancingTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", unique = true, nullable = false, length = 20)
    private AssetType assetType;

    @Column(nullable = false, length = 20)
    private String category; // '주식', '예금', '부동산'

    @Column(name = "target_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal targetRatio;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
