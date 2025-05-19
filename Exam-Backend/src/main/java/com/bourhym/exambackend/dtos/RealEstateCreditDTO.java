package com.bourhym.exambackend.dtos;

import com.bourhym.exambackend.entities.RealEstateCredit.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealEstateCreditDTO extends CreditDTO {
    private PropertyType propertyType;
    private String propertyAddress;
    private Double propertyValue;
}
