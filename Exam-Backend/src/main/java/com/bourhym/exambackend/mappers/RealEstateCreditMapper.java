package com.bourhym.exambackend.mappers;

import com.bourhym.exambackend.dtos.RealEstateCreditDTO;
import com.bourhym.exambackend.entities.RealEstateCredit;
import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RealEstateCreditMapper implements EntityMapper<RealEstateCreditDTO, RealEstateCredit> {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public RealEstateCredit toEntity(RealEstateCreditDTO dto) {
        if (dto == null) {
            return null;
        }

        RealEstateCredit realEstateCredit = new RealEstateCredit();
        realEstateCredit.setId(dto.getId());
        realEstateCredit.setRequestDate(dto.getRequestDate());
        realEstateCredit.setStatus(dto.getStatus());
        realEstateCredit.setAcceptanceDate(dto.getAcceptanceDate());
        realEstateCredit.setAmount(dto.getAmount());
        realEstateCredit.setDuration(dto.getDuration());
        realEstateCredit.setInterestRate(dto.getInterestRate());
        realEstateCredit.setPropertyType(dto.getPropertyType());

        // Récupérer le client par son ID
        if (dto.getClientId() != null) {
            clientRepository.findById(dto.getClientId())
                    .ifPresent(realEstateCredit::setClient);
        }

        return realEstateCredit;
    }

    @Override
    public RealEstateCreditDTO toDto(RealEstateCredit entity) {
        if (entity == null) {
            return null;
        }

        RealEstateCreditDTO realEstateCreditDTO = new RealEstateCreditDTO();
        realEstateCreditDTO.setId(entity.getId());
        realEstateCreditDTO.setRequestDate(entity.getRequestDate());
        realEstateCreditDTO.setStatus(entity.getStatus());
        realEstateCreditDTO.setAcceptanceDate(entity.getAcceptanceDate());
        realEstateCreditDTO.setAmount(entity.getAmount());
        realEstateCreditDTO.setDuration(entity.getDuration());
        realEstateCreditDTO.setInterestRate(entity.getInterestRate());
        realEstateCreditDTO.setPropertyType(entity.getPropertyType());

        // Définir le type de crédit
        realEstateCreditDTO.setCreditType("REAL_ESTATE");

        // Récupérer l'ID du client
        if (entity.getClient() != null) {
            realEstateCreditDTO.setClientId(entity.getClient().getId());
        }

        // Extraire les IDs des remboursements
        if (entity.getRepayments() != null) {
            realEstateCreditDTO.setRepaymentIds(entity.getRepayments().stream()
                    .map(Repayment::getId)
                    .collect(Collectors.toList()));
        }

        // Valeurs par défaut pour les champs ajoutés
        realEstateCreditDTO.setPropertyAddress("Adresse de la propriété");
        realEstateCreditDTO.setPropertyValue(entity.getAmount() * 1.2); // Estimation de 20% supérieure au montant du crédit

        return realEstateCreditDTO;
    }

    @Override
    public List<RealEstateCredit> toEntity(List<RealEstateCreditDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<RealEstateCreditDTO> toDto(List<RealEstateCredit> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
