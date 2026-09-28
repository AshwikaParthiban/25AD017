package Sem.example.Project.repository;

import Sem.example.Project.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MembershipRepository
        extends JpaRepository<Membership, Long> {

    // Latest membership of a member
    Optional<Membership> findTopByMemberIdOrderByExpiryDateDesc(Long memberId);

    // Memberships expiring within a date range
    List<Membership> findByExpiryDateBetween(
            LocalDate from,
            LocalDate to
    );

    // All memberships of a particular member
    List<Membership> findByMemberId(Long memberId);
}
