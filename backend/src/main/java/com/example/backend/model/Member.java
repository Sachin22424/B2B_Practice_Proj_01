package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Name is required")
    private String name;
    
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Member ID is required")
    private String memberId;
    
    @Column(nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @Column(nullable = false)
    @NotNull(message = "Active from date is required")
    private LocalDate activeFrom;

    @Column(nullable = false)
    @NotNull(message = "Active till date is required")
    @FutureOrPresent(message = "Active till date must be today or in the future")
    private LocalDate activeTill;

    @Column(nullable = false)
    @NotNull(message = "Status is required")
    private Boolean status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_roles", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotEmpty(message = "At least one role is required")
    private Set<Role> roles;
}
