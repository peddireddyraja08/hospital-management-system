package com.hospital.service;

import com.hospital.entity.IdCounter;
import com.hospital.repository.IdCounterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Centralized ID generation service for the entire Hospital Management System.
 * Generates unique IDs in format: PREFIX-YYYYMMDD-SEQUENCE
 * 
 * Examples:
 * - PAT-20250207-0001 (Patient)
 * - DOC-20250207-0001 (Doctor)
 * - BILL-20250207-0001 (Bill)
 * 
 * Features:
 * - Thread-safe using database pessimistic locking
 * - Sequential numbering per day per module
 * - Automatic daily reset of sequence counters
 * - Supports up to 9999 IDs per day per module
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class IdGeneratorService {

    private final IdCounterRepository idCounterRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final int SEQUENCE_LENGTH = 4; // 4 digits: 0001-9999

    /**
     * Generate a unique ID for the specified module prefix.
     * 
     * @param modulePrefix Module identifier (PAT, DOC, STF, LAB, MED, BILL, ADM, APT, SAMP, etc.)
     * @return Unique ID in format PREFIX-YYYYMMDD-SEQUENCE
     */
    public String generateId(String modulePrefix) {
        String dateKey = LocalDate.now().format(DATE_FORMATTER);
        
        // Get or create counter for this module and date with pessimistic lock
        IdCounter counter = idCounterRepository
                .findByModulePrefixAndDateKeyWithLock(modulePrefix, dateKey)
                .orElseGet(() -> createNewCounter(modulePrefix, dateKey));
        
        // Increment sequence
        int nextSequence = counter.getLastSequence() + 1;
        counter.setLastSequence(nextSequence);
        
        // Save updated counter
        idCounterRepository.save(counter);
        
        // Format: PREFIX-YYYYMMDD-SEQUENCE
        String generatedId = String.format("%s-%s-%0" + SEQUENCE_LENGTH + "d", 
                modulePrefix, dateKey, nextSequence);
        
        log.debug("Generated ID: {} for module: {}", generatedId, modulePrefix);
        
        return generatedId;
    }

    /**
     * Create a new counter for a module and date.
     * 
     * @param modulePrefix Module identifier
     * @param dateKey Date in YYYYMMDD format
     * @return New IdCounter entity
     */
    private IdCounter createNewCounter(String modulePrefix, String dateKey) {
        IdCounter newCounter = new IdCounter();
        newCounter.setModulePrefix(modulePrefix);
        newCounter.setDateKey(dateKey);
        newCounter.setLastSequence(0);
        return idCounterRepository.save(newCounter);
    }

    /**
     * Get the current sequence number for a module (without incrementing).
     * Useful for reporting or monitoring.
     * 
     * @param modulePrefix Module identifier
     * @return Current sequence number, or 0 if no counter exists for today
     */
    @Transactional(readOnly = true)
    public int getCurrentSequence(String modulePrefix) {
        String dateKey = LocalDate.now().format(DATE_FORMATTER);
        return idCounterRepository
                .findByModulePrefixAndDateKey(modulePrefix, dateKey)
                .map(IdCounter::getLastSequence)
                .orElse(0);
    }

    /**
     * Preview what the next ID will be without actually generating it.
     * 
     * @param modulePrefix Module identifier
     * @return Next ID that would be generated
     */
    @Transactional(readOnly = true)
    public String previewNextId(String modulePrefix) {
        String dateKey = LocalDate.now().format(DATE_FORMATTER);
        int currentSequence = getCurrentSequence(modulePrefix);
        int nextSequence = currentSequence + 1;
        
        return String.format("%s-%s-%0" + SEQUENCE_LENGTH + "d", 
                modulePrefix, dateKey, nextSequence);
    }
}
