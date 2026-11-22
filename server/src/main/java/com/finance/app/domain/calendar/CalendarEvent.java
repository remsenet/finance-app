package com.finance.app.domain.calendar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.finance.app.domain.asset.Asset;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "calendar_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEvent {

    @Id
    @Column(length = 50)
    private String id; // 예: 'CE-1'

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @JsonProperty("assetId")
    public Long getAssetId() {
        return asset != null ? asset.getId() : null;
    }

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 20)
    private String category; // '부동산', '예금', '주식', '지출', '저축'

    @Column(name = "flow_type", nullable = false, length = 20)
    private String flowType; // 'income', 'expense', 'neutral'

    @Column(name = "event_type", nullable = false, length = 20)
    private String eventType; // 'MATURITY', 'DIVIDEND', 'EXPENSE', 'INCOME', 'SAVING'

    @Column(nullable = false)
    @Builder.Default
    private Long amount = 0L;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
