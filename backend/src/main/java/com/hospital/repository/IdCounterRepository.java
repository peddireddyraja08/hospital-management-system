package com.hospital.repository;

import com.hospital.entity.IdCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;

/**
 * Repository for managing ID generation counters.
 * Uses pessimistic locking to ensure thread-safe counter increments.
 */
@Repository
public interface IdCounterRepository extends JpaRepository<IdCounter, Long> {

    /**
     * Find counter for a specific module and date with pessimistic write lock.
     * This ensures only one thread can increment the counter at a time.
     *
     * @param modulePrefix Module identifier (e.g., "PAT", "DOC")
     * @param dateKey Date in YYYYMMDD format
     * @return Optional containing the counter if found
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT ic FROM IdCounter ic WHERE ic.modulePrefix = :modulePrefix AND ic.dateKey = :dateKey")
    Optional<IdCounter> findByModulePrefixAndDateKeyWithLock(
            @Param("modulePrefix") String modulePrefix,
            @Param("dateKey") String dateKey);

    /**
     * Find counter without locking (for read-only operations).
     *
     * @param modulePrefix Module identifier
     * @param dateKey Date in YYYYMMDD format
     * @return Optional containing the counter if found
     */
    Optional<IdCounter> findByModulePrefixAndDateKey(String modulePrefix, String dateKey);
}
