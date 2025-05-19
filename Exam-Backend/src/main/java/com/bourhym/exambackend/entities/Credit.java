package com.bourhym.exambackend.entities;

import com.bourhym.exambackend.enums.CreditStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "CREDIT_TYPE")
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date requestDate;

    @Enumerated(EnumType.STRING)
    private CreditStatus status;

    @Temporal(TemporalType.DATE)
    private Date acceptanceDate;

    private Double amount;
    private Integer duration; // in months
    private Double interestRate;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "credit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Repayment> repayments;
}

