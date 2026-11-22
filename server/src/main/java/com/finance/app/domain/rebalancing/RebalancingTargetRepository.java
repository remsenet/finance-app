package com.finance.app.domain.rebalancing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RebalancingTargetRepository extends JpaRepository<RebalancingTarget, Long> {
}
