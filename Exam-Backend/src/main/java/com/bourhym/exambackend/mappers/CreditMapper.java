package com.bourhym.exambackend.mappers;

import com.bourhym.exambackend.dtos.CreditDTO;
import com.bourhym.exambackend.entities.Client;
import com.bourhym.exambackend.entities.Credit;
import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CreditMapper implements EntityMapper<CreditDTO, Credit> {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public Credit toEntity(CreditDTO dto) {
        if (dto == null) {
            return null;
        }

        Credit credit = new Credit();
        credit.setId(dto.getId());
        credit.setRequestDate(dto.getRequestDate());
        credit.setStatus(dto.getStatus());
        credit.setAcceptanceDate(dto.getAcceptanceDate());
        credit.setAmount(dto.getAmount());
        credit.setDuration(dto.getDuration());
        credit.setInterestRate(dto.getInterestRate());

        // Récupérer le client par son ID
        if (dto.getClientId() != null) {
            clientRepository.findById(dto.getClientId())
                    .ifPresent(credit::setClient);
        }

        return credit;
    }

    @Override
    public CreditDTO toDto(Credit entity) {
        if (entity == null) {
            return null;
        }

        CreditDTO creditDTO = new CreditDTO();
        creditDTO.setId(entity.getId());
        creditDTO.setRequestDate(entity.getRequestDate());
        creditDTO.setStatus(entity.getStatus());
        creditDTO.setAcceptanceDate(entity.getAcceptanceDate());
        creditDTO.setAmount(entity.getAmount());
        creditDTO.setDuration(entity.getDuration());
        creditDTO.setInterestRate(entity.getInterestRate());

        // Définir le type de crédit
        creditDTO.setCreditType(entity.getClass().getSimpleName());

        // Récupérer l'ID du client
        if (entity.getClient() != null) {
            creditDTO.setClientId(entity.getClient().getId());
        }

        // Extraire les IDs des remboursements
        if (entity.getRepayments() != null) {
            creditDTO.setRepaymentIds(entity.getRepayments().stream()
                    .map(Repayment::getId)
                    .collect(Collectors.toList()));
        }

        return creditDTO;
    }

    @Override
    public List<Credit> toEntity(List<CreditDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CreditDTO> toDto(List<Credit> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
