package com.bourhym.exambackend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("PROFESSIONAL")
public class ProfessionalCredit extends Credit {
    private String reason;
    private String companyName;
}