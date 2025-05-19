package com.banking.credit.entities;

import com.bourhym.exambackend.entities.Credit;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("PERSONAL")
public class PersonalCredit extends Credit {
    private String reason; // e.g., car purchase, studies, renovation
}