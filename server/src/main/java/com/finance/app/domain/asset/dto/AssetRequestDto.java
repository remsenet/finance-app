package com.finance.app.domain.asset.dto;

import com.finance.app.domain.asset.AssetType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class AssetRequestDto {
    private AssetType assetType;
    private String category;
    private String name;
    private Long purchaseAmount;
    private Long currentValue;
    private Long marketPrice;
    private BigDecimal taxRate;
    private BigDecimal interestRate;
    private LocalDate targetDate;
    private Integer dDay;
}
