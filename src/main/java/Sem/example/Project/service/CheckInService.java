package Sem.example.Project.service;

import Sem.example.Project.entity.CheckIn;
import Sem.example.Project.entity.Member;
import Sem.example.Project.entity.Membership;
import Sem.example.Project.repository.CheckInRepository;
import Sem.example.Project.repository.MemberRepository;
import Sem.example.Project.repository.MembershipRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final MemberRepository memberRepository;
    private final MembershipRepository membershipRepository;

    public CheckInService(
            CheckInRepository checkInRepository,
            MemberRepository memberRepository,
            MembershipRepository membershipRepository) {

        this.checkInRepository = checkInRepository;
        this.memberRepository = memberRepository;
        this.membershipRepository = membershipRepository;
    }

    public CheckIn checkInMember(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + memberId));

        LocalDate today = LocalDate.now();

        Membership membership = membershipRepository
                .findTopByMemberIdOrderByExpiryDateDesc(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member does not have a membership"));

        // Reject expired membership
        if (membership.getExpiryDate().isBefore(today)) {
            throw new RuntimeException(
                    "Check-in rejected: membership has expired");
        }

        // Prevent duplicate check-in
        if (checkInRepository.existsByMemberIdAndCheckInDate(
                memberId, today)) {

            throw new RuntimeException(
                    "Member has already checked in today");
        }

        CheckIn checkIn = new CheckIn();
        checkIn.setMember(member);
        checkIn.setCheckInDate(today);

        return checkInRepository.save(checkIn);
    }

    public List<CheckIn> getAllCheckIns() {
        return checkInRepository.findAll();
    }

    public CheckIn getCheckInById(Long id) {
        return checkInRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Check-in not found with ID: " + id));
    }

    public List<CheckIn> getCurrentMonthCheckIns() {

        LocalDate today = LocalDate.now();

        LocalDate firstDay = today.withDayOfMonth(1);

        LocalDate lastDay =
                today.withDayOfMonth(today.lengthOfMonth());

        return checkInRepository
                .findByCheckInDateBetweenOrderByCheckInDateDesc(
                        firstDay, lastDay);
    }

    public long getCurrentMonthAttendance(Long memberId) {

        LocalDate today = LocalDate.now();

        LocalDate firstDay = today.withDayOfMonth(1);

        LocalDate lastDay =
                today.withDayOfMonth(today.lengthOfMonth());

        return checkInRepository
                .countByMemberIdAndCheckInDateBetween(
                        memberId, firstDay, lastDay);
    }

    public List<CheckIn> getMemberCheckIns(Long memberId) {
        return checkInRepository
                .findByMemberIdOrderByCheckInDateDesc(memberId);
    }

    public void deleteCheckIn(Long id) {

        CheckIn checkIn = getCheckInById(id);

        checkInRepository.delete(checkIn);
    }
}
