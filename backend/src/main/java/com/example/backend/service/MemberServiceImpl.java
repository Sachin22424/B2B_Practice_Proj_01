package com.example.backend.service;

import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Member;
import com.example.backend.model.Role;
import com.example.backend.repository.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

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
    public Member getMemberByMemberId(String memberId) {
        return memberRepository.findByMemberIdIgnoreCase(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with memberId: " + memberId));
    }

    @Override
    public Member createMember(Member member) {
        if (memberRepository.existsByMemberId(member.getMemberId())) {
            throw new ConflictException("Member ID already exists");
        }

        if (member.getRoles() == null || member.getRoles().isEmpty()) {
            member.setRoles(Set.of(Role.AUDITOR));
        }

        validateActiveDates(member);

        if (!isCurrentDateInActiveRange(member.getActiveFrom(), member.getActiveTill())) {
            member.setStatus(false);
        }

        return memberRepository.save(member);
    }

    @Override
    public Member updateMember(Long id, Member member) {
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        if (memberRepository.existsByMemberIdAndIdNot(member.getMemberId(), id)) {
            throw new ConflictException("Member ID already exists");
        }

        validateActiveDates(member);

        existingMember.setName(member.getName());
        existingMember.setMemberId(member.getMemberId());
        existingMember.setEmail(member.getEmail());
        existingMember.setActiveFrom(member.getActiveFrom());
        existingMember.setActiveTill(member.getActiveTill());
        existingMember.setStatus(member.getStatus());
        existingMember.setRoles(member.getRoles());

        return memberRepository.save(existingMember);
    }

    @Override
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }

        memberRepository.deleteById(id);
    }

    private void validateActiveDates(Member member) {
        if (member.getActiveFrom() == null || member.getActiveTill() == null) {
            throw new BadRequestException("Active from and active till dates are required");
        }

        LocalDate today = LocalDate.now();
        if (member.getActiveTill().isBefore(today)) {
            throw new BadRequestException("Active till date cannot be in the past");
        }

        if (member.getActiveTill().isBefore(member.getActiveFrom())) {
            throw new BadRequestException("Active till date must be greater than or equal to active from date");
        }
    }

    private boolean isCurrentDateInActiveRange(LocalDate activeFrom, LocalDate activeTill) {
        LocalDate today = LocalDate.now();
        return !today.isBefore(activeFrom) && !today.isAfter(activeTill);
    }
}
