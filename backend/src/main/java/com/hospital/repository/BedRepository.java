package com.hospital.repository;

import com.hospital.entity.Bed;
import com.hospital.enums.BedStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
