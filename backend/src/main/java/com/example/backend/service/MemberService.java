package com.example.backend.service;

import com.example.backend.model.Member;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MemberService {
    List<Member> getAllMembers();

    Page<Member> getMembers(int page, int size, String search);

    Member getMemberById(Long id);

    Member getMemberByMemberId(String memberId);

    Member createMember(Member member);

    Member updateMember(Long id, Member member);

    void deleteMember(Long id);
}
