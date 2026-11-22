package com.finance.app.domain.ledger.dto;

import com.finance.app.domain.ledger.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LedgerRequestDto {
    private String id;
    private Long assetId;
    private String category;
    private TransactionType transactionType;
    private String typeDisplay;
    private String name;
    private Long amount;
    private Long unitPrice;
    private String quantity;
    private Long tax;
    private Long settledAmount;
    private String memo;
    private String status;
    private LocalDate transactionDate;
}
