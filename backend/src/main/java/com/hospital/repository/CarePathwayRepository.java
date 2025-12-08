package com.hospital.repository;

import com.hospital.entity.CarePathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarePathwayRepository extends JpaRepository<CarePathway, Long> {

    Optional<CarePathway> findByName(String name);

    List<CarePathway> findByDiagnosis(String diagnosis);

    List<CarePathway> findBySpecialty(String specialty);

    List<CarePathway> findByIsActive(Boolean isActive);

    @Query("SELECT c FROM CarePathway c WHERE c.isActive = true ORDER BY c.usageCount DESC")
    List<CarePathway> findMostUsedPathways();

    @Query("SELECT c FROM CarePathway c WHERE c.specialty = :specialty AND c.isActive = true")
    List<CarePathway> findActivePathwaysBySpecialty(@Param("specialty") String specialty);

    @Query("SELECT c FROM CarePathway c WHERE c.targetConditions LIKE %:condition% AND c.isActive = true")
    List<CarePathway> findByTargetCondition(@Param("condition") String condition);
}
