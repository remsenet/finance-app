package com.finance.app.domain.ledger;

import com.finance.app.domain.asset.Asset;
import com.finance.app.domain.asset.AssetRepository;
import com.finance.app.domain.ledger.dto.LedgerRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LedgerService {

    private final LedgerTransactionRepository ledgerRepository;
    private final AssetRepository assetRepository;

    public List<LedgerTransaction> getAllTransactions(String category) {
        if (category != null && !category.isBlank() && !"전체".equals(category)) {
            return ledgerRepository.findByCategoryOrderByTransactionDateDesc(category);
        }
        return ledgerRepository.findAllByOrderByTransactionDateDescCreatedAtDesc();
    }

    public LedgerTransaction getTransactionById(String id) {
        return ledgerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 거래 내역입니다. ID: " + id));
    }

    @Transactional
    public LedgerTransaction createTransaction(LedgerRequestDto dto) {
        Asset asset = null;
        if (dto.getAssetId() != null) {
            asset = assetRepository.findById(dto.getAssetId()).orElse(null);
        }

        String txId = dto.getId();
        if (txId == null || txId.isBlank()) {
            String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            txId = String.format("TX-%s-%s", dateStr, randomSuffix);
        }

        Long settled = dto.getSettledAmount();
        if (settled == null) {
            long taxVal = dto.getTax() != null ? dto.getTax() : 0L;
            settled = dto.getAmount() - taxVal;
        }

        LedgerTransaction tx = LedgerTransaction.builder()
                .id(txId)
                .asset(asset)
                .category(dto.getCategory())
                .transactionType(dto.getTransactionType() != null ? dto.getTransactionType() : TransactionType.BUY)
                .typeDisplay(dto.getTypeDisplay() != null ? dto.getTypeDisplay() : "매수")
                .name(dto.getName())
                .amount(dto.getAmount())
                .unitPrice(dto.getUnitPrice())
                .quantity(dto.getQuantity())
                .tax(dto.getTax() != null ? dto.getTax() : 0L)
                .settledAmount(settled)
                .memo(dto.getMemo())
                .status(dto.getStatus() != null ? dto.getStatus() : "완료")
                .transactionDate(dto.getTransactionDate() != null ? dto.getTransactionDate() : LocalDate.now())
                .build();

        return ledgerRepository.save(tx);
    }

    @Transactional
    public void deleteTransaction(String id) {
        LedgerTransaction tx = getTransactionById(id);
        ledgerRepository.delete(tx);
    }
}
