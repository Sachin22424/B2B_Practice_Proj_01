package com.example.backend.config;

import com.example.backend.model.Member;
import com.example.backend.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {
    
    @Bean
    CommandLineRunner initDatabase(MemberRepository memberRepository) {
        return args -> {
            // ...existing code...
            memberRepository.save(new Member(null, "Sachin", "B2B-001", "sahin@gmail.com", LocalDate.of(2026, 3, 5)));
            memberRepository.save(new Member(null, "Rohit", "B2B-002", "rohit@gmail.com", LocalDate.of(2026, 3, 12)));
            memberRepository.save(new Member(null, "Dhoni", "B2B-003", "dhoni@gmail.com", LocalDate.of(2026, 3, 18)));

            memberRepository.save(new Member(null, "Virat", "B2B-004", "virat@gmail.com", LocalDate.of(2026, 3, 20)));
            memberRepository.save(new Member(null, "Rahul", "B2B-005", "rahul@gmail.com", LocalDate.of(2026, 3, 22)));
            memberRepository.save(new Member(null, "Shikhar", "B2B-006", "shikhar@gmail.com", LocalDate.of(2026, 3, 24)));
            memberRepository.save(new Member(null, "Hardik", "B2B-007", "hardik@gmail.com", LocalDate.of(2026, 3, 26)));
            memberRepository.save(new Member(null, "Jadeja", "B2B-008", "jadeja@gmail.com", LocalDate.of(2026, 3, 28)));
            memberRepository.save(new Member(null, "Ashwin", "B2B-009", "ashwin@gmail.com", LocalDate.of(2026, 3, 30)));
            memberRepository.save(new Member(null, "Bumrah", "B2B-010", "bumrah@gmail.com", LocalDate.of(2026, 4, 1)));
            memberRepository.save(new Member(null, "Shami", "B2B-011", "shami@gmail.com", LocalDate.of(2026, 4, 3)));
            memberRepository.save(new Member(null, "Ishant", "B2B-012", "ishant@gmail.com", LocalDate.of(2026, 4, 5)));
            memberRepository.save(new Member(null, "Surya", "B2B-013", "surya@gmail.com", LocalDate.of(2026, 4, 7)));
            memberRepository.save(new Member(null, "Rishabh", "B2B-014", "rishabh@gmail.com", LocalDate.of(2026, 4, 9)));
            memberRepository.save(new Member(null, "Kuldeep", "B2B-015", "kuldeep@gmail.com", LocalDate.of(2026, 4, 11)));
            memberRepository.save(new Member(null, "Chahal", "B2B-016", "chahal@gmail.com", LocalDate.of(2026, 4, 13)));
            memberRepository.save(new Member(null, "Axar", "B2B-017", "axar@gmail.com", LocalDate.of(2026, 4, 15)));
            memberRepository.save(new Member(null, "Arshdeep", "B2B-018", "arshdeep@gmail.com", LocalDate.of(2026, 4, 17)));
            memberRepository.save(new Member(null, "Gill", "B2B-019", "gill@gmail.com", LocalDate.of(2026, 4, 19)));
            memberRepository.save(new Member(null, "Iyer", "B2B-020", "iyer@gmail.com", LocalDate.of(2026, 4, 21)));

            System.out.println("Initial data loaded successfully!");
        };
    }
}