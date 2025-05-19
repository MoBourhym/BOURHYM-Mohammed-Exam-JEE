package com.bourhym.exambackend.mappers;

import com.bourhym.exambackend.dtos.ProfessionalCreditDTO;
import com.bourhym.exambackend.entities.ProfessionalCredit;
import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProfessionalCreditMapper implements EntityMapper<ProfessionalCreditDTO, ProfessionalCredit> {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public ProfessionalCredit toEntity(ProfessionalCreditDTO dto) {
        if (dto == null) {
            return null;
        }

        ProfessionalCredit professionalCredit = new ProfessionalCredit();
        professionalCredit.setId(dto.getId());
        professionalCredit.setRequestDate(dto.getRequestDate());
        professionalCredit.setStatus(dto.getStatus());
        professionalCredit.setAcceptanceDate(dto.getAcceptanceDate());
        professionalCredit.setAmount(dto.getAmount());
        professionalCredit.setDuration(dto.getDuration());
        professionalCredit.setInterestRate(dto.getInterestRate());

        // Récupérer le client par son ID
        if (dto.getClientId() != null) {
            clientRepository.findById(dto.getClientId())
                    .ifPresent(professionalCredit::setClient);
        }

        // Champs spécifiques aux crédits professionnels
        // Note: Ces champs doivent être ajoutés à l'entité ProfessionalCredit

        return professionalCredit;
    }

    @Override
    public ProfessionalCreditDTO toDto(ProfessionalCredit entity) {
        if (entity == null) {
            return null;
        }

        ProfessionalCreditDTO professionalCreditDTO = new ProfessionalCreditDTO();
        professionalCreditDTO.setId(entity.getId());
        professionalCreditDTO.setRequestDate(entity.getRequestDate());
        professionalCreditDTO.setStatus(entity.getStatus());
        professionalCreditDTO.setAcceptanceDate(entity.getAcceptanceDate());
        professionalCreditDTO.setAmount(entity.getAmount());
        professionalCreditDTO.setDuration(entity.getDuration());
        professionalCreditDTO.setInterestRate(entity.getInterestRate());

        // Définir le type de crédit
        professionalCreditDTO.setCreditType("PROFESSIONAL");

        // Récupérer l'ID du client
        if (entity.getClient() != null) {
            professionalCreditDTO.setClientId(entity.getClient().getId());
        }

        // Extraire les IDs des remboursements
        if (entity.getRepayments() != null) {
            professionalCreditDTO.setRepaymentIds(entity.getRepayments().stream()
                    .map(Repayment::getId)
                    .collect(Collectors.toList()));
        }

        // Valeurs par défaut pour les champs spécifiques
        professionalCreditDTO.setCompanyName("Entreprise");
        professionalCreditDTO.setBusinessSector("Secteur d'activité");
        professionalCreditDTO.setYearsInBusiness(5);

        return professionalCreditDTO;
    }

    @Override
    public List<ProfessionalCredit> toEntity(List<ProfessionalCreditDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessionalCreditDTO> toDto(List<ProfessionalCredit> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
