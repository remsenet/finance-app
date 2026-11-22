package com.finance.app.domain.goal;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalRepository goalRepository;

    @GetMapping
    public ResponseEntity<Goal> getPrimaryGoal() {
        return goalRepository.findFirstByOrderByIdAsc()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<Goal> updateGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(goalRepository.save(goal));
    }
}
