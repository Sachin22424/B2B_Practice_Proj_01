package com.example.backend.service;

import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Member;
import com.example.backend.repository.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Page<Member> getMembers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        if (search == null || search.isBlank()) {
            return memberRepository.findAll(pageable);
        }

        String normalizedSearch = search.trim();
        return memberRepository.findByNameContainingIgnoreCaseOrMemberIdContainingIgnoreCaseOrEmailContainingIgnoreCase(
                normalizedSearch,
                normalizedSearch,
                normalizedSearch,
                pageable
        );
    }

    @Override
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    @Override
    public Member createMember(Member member) {
        if (memberRepository.existsByMemberId(member.getMemberId())) {
            throw new ConflictException("Member ID already exists");
        }

        if (member.getBillDue() != null && member.getBillDue().isBefore(LocalDate.now())) {
            throw new BadRequestException("Bill due date cannot be in the past");
        }

        return memberRepository.save(member);
    }

    @Override
    public Member updateMember(Long id, Member member) {
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        if (member.getBillDue() != null && member.getBillDue().isBefore(LocalDate.now())) {
            throw new BadRequestException("Bill due date cannot be in the past");
        }

        existingMember.setName(member.getName());
        existingMember.setEmail(member.getEmail());
        existingMember.setBillDue(member.getBillDue());

        return memberRepository.save(existingMember);
    }

    @Override
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }

        memberRepository.deleteById(id);
    }
}
