package com.finance.app.domain.ledger;

import com.finance.app.domain.ledger.dto.LedgerRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    @GetMapping
    public ResponseEntity<List<LedgerTransaction>> getTransactions(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(ledgerService.getAllTransactions(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LedgerTransaction> getTransactionById(@PathVariable String id) {
        return ResponseEntity.ok(ledgerService.getTransactionById(id));
    }

    @PostMapping
    public ResponseEntity<LedgerTransaction> createTransaction(@RequestBody LedgerRequestDto dto) {
        LedgerTransaction created = ledgerService.createTransaction(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String id) {
        ledgerService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
