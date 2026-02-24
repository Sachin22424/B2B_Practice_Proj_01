package com.example.backend.repository;

import com.example.backend.model.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByMemberId(String memberId);

    boolean existsByMemberIdAndIdNot(String memberId, Long id);

    Page<Member> findByNameContainingIgnoreCaseOrMemberIdContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name,
            String memberId,
            String email,
            Pageable pageable
    );
}
