package com.example.backend.config;

import com.example.backend.model.Member;
import com.example.backend.model.Role;
import com.example.backend.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Set;

@Configuration
public class DataLoader {
    
    @Bean
    CommandLineRunner initDatabase(MemberRepository memberRepository) {
        return args -> {
            LocalDate today = LocalDate.now();

            memberRepository.save(new Member(null, "Sachin", "B2B-001", "sachin@gmail.com", today, today.plusDays(30), true, Set.of(Role.ADMIN, Role.FINANCE)));
            memberRepository.save(new Member(null, "Rohit", "B2B-002", "rohit@gmail.com", today.plusDays(1), today.plusDays(31), true, Set.of(Role.BILLING)));
            memberRepository.save(new Member(null, "Dhoni", "B2B-003", "dhoni@gmail.com", today.plusDays(2), today.plusDays(32), true, Set.of(Role.FINANCE)));

            memberRepository.save(new Member(null, "Virat", "B2B-004", "virat@gmail.com", today.plusDays(3), today.plusDays(33), true, Set.of(Role.AUDITOR)));
            memberRepository.save(new Member(null, "Rahul", "B2B-005", "rahul@gmail.com", today.plusDays(4), today.plusDays(34), true, Set.of(Role.BILLING, Role.AUDITOR)));
            memberRepository.save(new Member(null, "Shikhar", "B2B-006", "shikhar@gmail.com", today.plusDays(5), today.plusDays(35), true, Set.of(Role.FINANCE)));
            memberRepository.save(new Member(null, "Hardik", "B2B-007", "hardik@gmail.com", today.plusDays(6), today.plusDays(36), false, Set.of(Role.AUDITOR)));
            memberRepository.save(new Member(null, "Jadeja", "B2B-008", "jadeja@gmail.com", today.plusDays(7), today.plusDays(37), true, Set.of(Role.BILLING)));
            memberRepository.save(new Member(null, "Ashwin", "B2B-009", "ashwin@gmail.com", today.plusDays(8), today.plusDays(38), false, Set.of(Role.AUDITOR)));
            memberRepository.save(new Member(null, "Bumrah", "B2B-010", "bumrah@gmail.com", today.plusDays(9), today.plusDays(39), true, Set.of(Role.FINANCE, Role.BILLING)));
            memberRepository.save(new Member(null, "Shami", "B2B-011", "shami@gmail.com", today.plusDays(10), today.plusDays(40), true, Set.of(Role.BILLING)));
            memberRepository.save(new Member(null, "Ishant", "B2B-012", "ishant@gmail.com", today.plusDays(11), today.plusDays(41), false, Set.of(Role.AUDITOR)));
            memberRepository.save(new Member(null, "Surya", "B2B-013", "surya@gmail.com", today.plusDays(12), today.plusDays(42), true, Set.of(Role.FINANCE)));
            memberRepository.save(new Member(null, "Rishabh", "B2B-014", "rishabh@gmail.com", today.plusDays(13), today.plusDays(43), true, Set.of(Role.BILLING)));
            memberRepository.save(new Member(null, "Kuldeep", "B2B-015", "kuldeep@gmail.com", today.plusDays(14), today.plusDays(44), false, Set.of(Role.AUDITOR)));
            memberRepository.save(new Member(null, "Chahal", "B2B-016", "chahal@gmail.com", today.plusDays(15), today.plusDays(45), true, Set.of(Role.FINANCE)));
            memberRepository.save(new Member(null, "Axar", "B2B-017", "axar@gmail.com", today.plusDays(16), today.plusDays(46), true, Set.of(Role.BILLING)));
            memberRepository.save(new Member(null, "Arshdeep", "B2B-018", "arshdeep@gmail.com", today.plusDays(17), today.plusDays(47), false, Set.of(Role.AUDITOR)));
            memberRepository.save(new Member(null, "Gill", "B2B-019", "gill@gmail.com", today.plusDays(18), today.plusDays(48), true, Set.of(Role.FINANCE)));
            memberRepository.save(new Member(null, "Iyer", "B2B-020", "iyer@gmail.com", today.plusDays(19), today.plusDays(49), true, Set.of(Role.BILLING, Role.FINANCE)));

            System.out.println("Initial data loaded successfully!");
        };
    }
}