package com.bourhym.exambackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionalCreditDTO extends CreditDTO {
    private String companyName;
    private String businessSector;
    private Integer yearsInBusiness;
}
