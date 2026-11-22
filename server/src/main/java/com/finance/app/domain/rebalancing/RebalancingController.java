package com.finance.app.domain.rebalancing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rebalancing")
@RequiredArgsConstructor
public class RebalancingController {

    private final RebalancingTargetRepository rebalancingRepository;

    @GetMapping
    public ResponseEntity<List<RebalancingTarget>> getTargets() {
        return ResponseEntity.ok(rebalancingRepository.findAll());
    }

    @PutMapping
    public ResponseEntity<List<RebalancingTarget>> updateTargets(@RequestBody List<RebalancingTarget> targets) {
        return ResponseEntity.ok(rebalancingRepository.saveAll(targets));
    }
}
