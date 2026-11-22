package com.finance.app.domain.ledger;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerTransactionRepository extends JpaRepository<LedgerTransaction, String> {
    List<LedgerTransaction> findAllByOrderByTransactionDateDescCreatedAtDesc();
    List<LedgerTransaction> findByCategoryOrderByTransactionDateDesc(String category);
}
