package com.bourhym.exambackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalCreditDTO extends CreditDTO {
    // Attributs spécifiques aux crédits personnels pourraient être ajoutés ici
    private String purpose; // Objet du crédit personnel
}
