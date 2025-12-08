package com.hospital.repository;

import com.hospital.entity.NurseTask;
import com.hospital.enums.TaskPriority;
import com.hospital.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NurseTaskRepository extends JpaRepository<NurseTask, Long> {

    List<NurseTask> findByAdmissionId(Long admissionId);

    List<NurseTask> findByStatus(TaskStatus status);

    List<NurseTask> findByAssignedToNurse(String nurseName);

    @Query("SELECT t FROM NurseTask t WHERE t.status = 'PENDING' AND t.scheduledTime <= :now")
    List<NurseTask> findDueTasks(@Param("now") LocalDateTime now);

    @Query("SELECT t FROM NurseTask t WHERE t.status IN ('PENDING', 'DUE_SOON', 'IN_PROGRESS') AND t.scheduledTime < :now")
    List<NurseTask> findOverdueTasks(@Param("now") LocalDateTime now);

    @Query("SELECT t FROM NurseTask t WHERE t.status IN ('PENDING', 'DUE', 'IN_PROGRESS', 'OVERDUE')")
    List<NurseTask> findActiveTasks();

    @Query("SELECT t FROM NurseTask t WHERE (t.isDeleted = false OR t.isDeleted IS NULL) ORDER BY t.scheduledTime DESC")
    List<NurseTask> findAllNonDeletedTasks();

    @Query("SELECT t FROM NurseTask t ORDER BY t.scheduledTime DESC")
    List<NurseTask> findAllTasks();

    @Query("SELECT t FROM NurseTask t WHERE t.admission.currentBed.wardName = :ward AND t.status IN ('PENDING', 'DUE', 'IN_PROGRESS', 'OVERDUE')")
    List<NurseTask> findActiveTasksByWard(@Param("ward") String ward);

    @Query("SELECT t FROM NurseTask t WHERE t.assignedToNurse = :nurse AND t.status IN ('PENDING', 'DUE', 'IN_PROGRESS', 'OVERDUE')")
    List<NurseTask> findActiveTasksByNurse(@Param("nurse") String nurse);

    @Query("SELECT t FROM NurseTask t WHERE t.priority = :priority AND t.status IN ('PENDING', 'DUE', 'IN_PROGRESS', 'OVERDUE')")
    List<NurseTask> findActiveTasksByPriority(@Param("priority") TaskPriority priority);

    @Query("SELECT t FROM NurseTask t WHERE t.taskType = :taskType AND t.status IN ('PENDING', 'DUE', 'IN_PROGRESS', 'OVERDUE')")
    List<NurseTask> findActiveTasksByType(@Param("taskType") String taskType);

    @Query("SELECT COUNT(t) FROM NurseTask t WHERE t.status IN ('PENDING', 'DUE_SOON', 'IN_PROGRESS', 'OVERDUE')")
    Long countActiveTasks();

    @Query("SELECT COUNT(t) FROM NurseTask t WHERE t.status IN ('PENDING', 'DUE_SOON', 'IN_PROGRESS') AND t.scheduledTime < :now")
    Long countOverdueTasks(@Param("now") LocalDateTime now);

    @Query("SELECT t FROM NurseTask t WHERE t.scheduledTime BETWEEN :start AND :end")
    List<NurseTask> findTasksByScheduleRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT t.taskType, COUNT(t) FROM NurseTask t WHERE t.status IN ('PENDING', 'DUE_SOON', 'IN_PROGRESS', 'OVERDUE') GROUP BY t.taskType")
    List<Object[]> getTaskCountByType();
}
