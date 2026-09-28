package Sem.example.Project.service;

import Sem.example.Project.entity.Member;
import Sem.example.Project.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + id));
    }

    public Member updateMember(
            Long id,
            Member updatedMember) {

        Member existingMember = getMemberById(id);

        existingMember.setName(updatedMember.getName());
        existingMember.setEmail(updatedMember.getEmail());
        existingMember.setPhone(updatedMember.getPhone());

        return memberRepository.save(existingMember);
    }

    public void deleteMember(Long id) {

        Member member = getMemberById(id);

        memberRepository.delete(member);
    }
}
