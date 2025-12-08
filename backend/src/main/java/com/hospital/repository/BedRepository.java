package com.hospital.repository;

import com.hospital.entity.Bed;
import com.hospital.enums.BedStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    Optional<Bed> findByBedNumber(String bedNumber);
    List<Bed> findByStatus(BedStatus status);
    List<Bed> findByWardName(String wardName);
    List<Bed> findByBedType(String bedType);
    List<Bed> findByWardNameAndStatus(String wardName, BedStatus status);
    Boolean existsByBedNumber(String bedNumber);

    // Enhanced queries for IPD module
    @Query("SELECT b FROM Bed b WHERE b.status = 'AVAILABLE' AND b.isBlocked = false")
    List<Bed> findAvailableBedsForAdmission();

    @Query("SELECT b FROM Bed b WHERE b.wardName = :ward AND b.status = 'AVAILABLE' AND b.isBlocked = false")
    List<Bed> findAvailableBedsInWard(@Param("ward") String ward);

    @Query("SELECT b FROM Bed b WHERE b.bedType = :bedType AND b.status = 'AVAILABLE' AND b.isBlocked = false")
    List<Bed> findAvailableBedsByType(@Param("bedType") String bedType);

    @Query("SELECT b FROM Bed b WHERE b.isIsolationBed = true AND b.status = 'AVAILABLE' AND b.isBlocked = false")
    List<Bed> findAvailableIsolationBeds();

    @Query("SELECT b FROM Bed b WHERE b.hasVentilator = true AND b.status = 'AVAILABLE' AND b.isBlocked = false")
    List<Bed> findAvailableBedsWithVentilator();

    @Query("SELECT b FROM Bed b WHERE b.isBlocked = true AND b.blockedUntil > :now")
    List<Bed> findActivelyBlockedBeds(@Param("now") LocalDateTime now);

    @Query("SELECT b FROM Bed b WHERE b.status = 'OCCUPIED' AND b.expectedVacantAt <= :date")
    List<Bed> findBedsExpectedVacant(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.wardName = :ward")
    Long countBedsByWard(@Param("ward") String ward);

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.wardName = :ward AND b.status = 'OCCUPIED'")
    Long countOccupiedBedsByWard(@Param("ward") String ward);

    @Query("SELECT b.wardName, COUNT(b), SUM(CASE WHEN b.status = 'OCCUPIED' THEN 1 ELSE 0 END) FROM Bed b GROUP BY b.wardName")
    List<Object[]> getBedOccupancyByWard();

    @Query("SELECT b FROM Bed b WHERE b.status = 'MAINTENANCE' OR (b.nextMaintenanceDate IS NOT NULL AND b.nextMaintenanceDate <= :date)")
    List<Bed> findBedsRequiringMaintenance(@Param("date") LocalDateTime date);

    List<Bed> findByIsIsolationBed(Boolean isIsolationBed);

    List<Bed> findByBedTypeAndWardName(String bedType, String wardName);
}
