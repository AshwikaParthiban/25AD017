package Sem.example.Project.controller;

import Sem.example.Project.entity.Membership;
import Sem.example.Project.service.MembershipService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(
            MembershipService membershipService) {

        this.membershipService = membershipService;
    }

    // GET ALL
    @GetMapping
    public List<Membership> getAllMemberships() {
        return membershipService.getAllMemberships();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Membership getMembershipById(
            @PathVariable Long id) {

        return membershipService.getMembershipById(id);
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Membership createMembership(
            @RequestParam Long memberId,
            @RequestParam Long planId) {

        return membershipService.createMembership(
                memberId,
                planId
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public Membership updateMembership(
            @PathVariable Long id,
            @RequestParam Long memberId,
            @RequestParam Long planId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate expiryDate) {

        return membershipService.updateMembership(
                id,
                memberId,
                planId,
                startDate,
                expiryDate
        );
    }

    // RENEW
    @PostMapping("/renew")
    @ResponseStatus(HttpStatus.CREATED)
    public Membership renewMembership(
            @RequestParam Long memberId,
            @RequestParam Long planId) {

        return membershipService.renewMembership(
                memberId,
                planId
        );
    }

    // EXPIRING IN NEXT 7 DAYS
    @GetMapping("/expiring")
    public List<Membership> getExpiringMemberships() {
        return membershipService.getExpiringMemberships();
    }

    // GET MEMBERSHIPS OF ONE MEMBER
    @GetMapping("/member/{memberId}")
    public List<Membership> getMembershipsByMember(
            @PathVariable Long memberId) {

        return membershipService
                .getMembershipsByMember(memberId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMembership(
            @PathVariable Long id) {

        membershipService.deleteMembership(id);
    }
}
