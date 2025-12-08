package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity to store ID generation counters for each module.
 * Ensures sequential ID generation with format: PREFIX-YYYYMMDD-SEQUENCE
 * Counter resets daily for each module prefix.
 */
@Entity
@Table(name = "id_counter", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"modulePrefix", "dateKey"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdCounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "module_prefix", nullable = false, length = 10)
    private String modulePrefix;

    @Column(name = "date_key", nullable = false, length = 8)
    private String dateKey; // Format: YYYYMMDD

    @Column(name = "last_sequence", nullable = false)
    private Integer lastSequence = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
