package com.bourhym.exambackend.dtos;

import com.bourhym.exambackend.enums.CreditStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditDTO {
    private Long id;
    private Date requestDate;
    private CreditStatus status;
    private Date acceptanceDate;
    private Double amount;
    private Integer duration; // en mois
    private Double interestRate;
    private Long clientId;
    private List<Long> repaymentIds;
    private String creditType; // Utilisé pour identifier le type de crédit
}
