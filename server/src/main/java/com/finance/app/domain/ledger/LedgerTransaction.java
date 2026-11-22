package com.finance.app.domain.ledger;

import com.finance.app.domain.asset.Asset;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "ledger_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerTransaction {

    @Id
    @Column(length = 50)
    private String id; // 예: 'TX-20261114-01'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @Column(nullable = false, length = 20)
    private String category; // '주식', '예금', '부동산'

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;

    @Column(name = "type_display", nullable = false, length = 20)
    private String typeDisplay; // '매수', '매도', '배당', '이자'

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Long amount;

    @Column(name = "unit_price")
    private Long unitPrice;

    @Column(length = 50)
    private String quantity;

    @Column(nullable = false)
    @Builder.Default
    private Long tax = 0L;

    @Column(name = "settled_amount", nullable = false)
    private Long settledAmount;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(length = 20)
    @Builder.Default
    private String status = "완료";

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
