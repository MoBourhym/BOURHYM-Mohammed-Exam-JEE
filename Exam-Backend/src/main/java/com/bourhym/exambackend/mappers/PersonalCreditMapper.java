package com.bourhym.exambackend.mappers;

import com.bourhym.exambackend.dtos.PersonalCreditDTO;
import com.bourhym.exambackend.entities.PersonalCredit;
import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PersonalCreditMapper implements EntityMapper<PersonalCreditDTO, PersonalCredit> {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public PersonalCredit toEntity(PersonalCreditDTO dto) {
        if (dto == null) {
            return null;
        }

        PersonalCredit personalCredit = new PersonalCredit();
        personalCredit.setId(dto.getId());
        personalCredit.setRequestDate(dto.getRequestDate());
        personalCredit.setStatus(dto.getStatus());
        personalCredit.setAcceptanceDate(dto.getAcceptanceDate());
        personalCredit.setAmount(dto.getAmount());
        personalCredit.setDuration(dto.getDuration());
        personalCredit.setInterestRate(dto.getInterestRate());

        // Récupérer le client par son ID
        if (dto.getClientId() != null) {
            clientRepository.findById(dto.getClientId())
                    .ifPresent(personalCredit::setClient);
        }

        // On pourrait ajouter ici des champs spécifiques au crédit personnel
        // Pour l'instant, nous n'avons pas ajouté de champs spécifiques dans l'entité

        return personalCredit;
    }

    @Override
    public PersonalCreditDTO toDto(PersonalCredit entity) {
        if (entity == null) {
            return null;
        }

        PersonalCreditDTO personalCreditDTO = new PersonalCreditDTO();
        personalCreditDTO.setId(entity.getId());
        personalCreditDTO.setRequestDate(entity.getRequestDate());
        personalCreditDTO.setStatus(entity.getStatus());
        personalCreditDTO.setAcceptanceDate(entity.getAcceptanceDate());
        personalCreditDTO.setAmount(entity.getAmount());
        personalCreditDTO.setDuration(entity.getDuration());
        personalCreditDTO.setInterestRate(entity.getInterestRate());

        // Définir le type de crédit
        personalCreditDTO.setCreditType("PERSONAL");

        // Récupérer l'ID du client
        if (entity.getClient() != null) {
            personalCreditDTO.setClientId(entity.getClient().getId());
        }

        // Extraire les IDs des remboursements
        if (entity.getRepayments() != null) {
            personalCreditDTO.setRepaymentIds(entity.getRepayments().stream()
                    .map(Repayment::getId)
                    .collect(Collectors.toList()));
        }

        // Par défaut, on peut définir une valeur pour le purpose
        personalCreditDTO.setPurpose("Crédit personnel");

        return personalCreditDTO;
    }

    @Override
    public List<PersonalCredit> toEntity(List<PersonalCreditDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<PersonalCreditDTO> toDto(List<PersonalCredit> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
