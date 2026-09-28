package Sem.example.Project.service;

import Sem.example.Project.entity.Member;
import Sem.example.Project.entity.Membership;
import Sem.example.Project.entity.Plan;
import Sem.example.Project.repository.MemberRepository;
import Sem.example.Project.repository.MembershipRepository;
import Sem.example.Project.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;

    public MembershipService(
            MembershipRepository membershipRepository,
            MemberRepository memberRepository,
            PlanRepository planRepository) {

        this.membershipRepository = membershipRepository;
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
    }

    // CREATE MEMBERSHIP
    public Membership createMembership(Long memberId, Long planId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + memberId));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plan not found with ID: " + planId));

        LocalDate startDate = LocalDate.now();

        LocalDate expiryDate =
                startDate.plusMonths(plan.getDurationMonths());

        Membership membership = new Membership();

        membership.setMember(member);
        membership.setPlan(plan);
        membership.setStartDate(startDate);
        membership.setExpiryDate(expiryDate);

        return membershipRepository.save(membership);
    }

    // READ ALL
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    // READ BY ID
    public Membership getMembershipById(Long id) {

        return membershipRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Membership not found with ID: " + id));
    }

    // UPDATE MEMBERSHIP
    public Membership updateMembership(
            Long id,
            Long memberId,
            Long planId,
            LocalDate startDate,
            LocalDate expiryDate) {

        Membership membership = getMembershipById(id);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + memberId));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plan not found with ID: " + planId));

        if (expiryDate.isBefore(startDate)) {
            throw new RuntimeException(
                    "Expiry date cannot be before start date");
        }

        membership.setMember(member);
        membership.setPlan(plan);
        membership.setStartDate(startDate);
        membership.setExpiryDate(expiryDate);

        return membershipRepository.save(membership);
    }

    // RENEW MEMBERSHIP
    public Membership renewMembership(Long memberId, Long planId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + memberId));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plan not found with ID: " + planId));

        LocalDate today = LocalDate.now();

        LocalDate startDate = today;

        // Find the latest membership of the member
        var latestMembership =
                membershipRepository
                        .findTopByMemberIdOrderByExpiryDateDesc(memberId);

        // If current membership is still active,
        // start renewal from its expiry date
        if (latestMembership.isPresent()
                && !latestMembership.get()
                .getExpiryDate()
                .isBefore(today)) {

            startDate =
                    latestMembership.get().getExpiryDate();
        }

        LocalDate expiryDate =
                startDate.plusMonths(
                        plan.getDurationMonths());

        Membership renewal = new Membership();

        renewal.setMember(member);
        renewal.setPlan(plan);
        renewal.setStartDate(startDate);
        renewal.setExpiryDate(expiryDate);

        return membershipRepository.save(renewal);
    }

    // GET MEMBERSHIPS EXPIRING IN NEXT 7 DAYS
    public List<Membership> getExpiringMemberships() {

        LocalDate today = LocalDate.now();

        LocalDate nextSevenDays =
                today.plusDays(7);

        return membershipRepository
                .findByExpiryDateBetween(
                        today,
                        nextSevenDays);
    }

    // GET ALL MEMBERSHIPS OF ONE MEMBER
    public List<Membership> getMembershipsByMember(
            Long memberId) {

        return membershipRepository
                .findByMemberId(memberId);
    }

    // DELETE
    public void deleteMembership(Long id) {

        Membership membership =
                getMembershipById(id);

        membershipRepository.delete(membership);
    }
}
