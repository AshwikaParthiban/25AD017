package Sem.example.Project.repository;

import Sem.example.Project.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CheckInRepository
        extends JpaRepository<CheckIn, Long> {

    // Check whether member already checked in today
    boolean existsByMemberIdAndCheckInDate(
            Long memberId,
            LocalDate checkInDate
    );

    // Current month check-ins
    List<CheckIn> findByCheckInDateBetweenOrderByCheckInDateDesc(
            LocalDate from,
            LocalDate to
    );

    // Member's check-ins
    List<CheckIn> findByMemberIdOrderByCheckInDateDesc(
            Long memberId
    );

    // Count member's attendance
    long countByMemberIdAndCheckInDateBetween(
            Long memberId,
            LocalDate from,
            LocalDate to
    );
}
