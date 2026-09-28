package Sem.example.Project.controller;

import Sem.example.Project.entity.Member;
import Sem.example.Project.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // GET ALL MEMBERS
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // GET MEMBER BY ID
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

    // CREATE MEMBER
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Member createMember(@Valid @RequestBody Member member) {
        return memberService.createMember(member);
    }

    // UPDATE MEMBER
    @PutMapping("/{id}")
    public Member updateMember(
            @PathVariable Long id,
            @Valid @RequestBody Member member) {

        return memberService.updateMember(id, member);
    }

    // DELETE MEMBER
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
    }
}
