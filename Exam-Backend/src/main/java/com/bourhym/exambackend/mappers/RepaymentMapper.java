package com.bourhym.exambackend.mappers;

import com.bourhym.exambackend.dtos.RepaymentDTO;
import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.repositories.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RepaymentMapper implements EntityMapper<RepaymentDTO, Repayment> {

    @Autowired
    private CreditRepository creditRepository;

    @Override
    public Repayment toEntity(RepaymentDTO dto) {
        if (dto == null) {
            return null;
        }

        Repayment repayment = new Repayment();
        repayment.setId(dto.getId());
        repayment.setDate(dto.getDate());
        repayment.setAmount(dto.getAmount());
        repayment.setType(dto.getType());

        // Récupérer le crédit par son ID
        if (dto.getCreditId() != null) {
            creditRepository.findById(dto.getCreditId())
                    .ifPresent(repayment::setCredit);
        }

        return repayment;
    }

    @Override
    public RepaymentDTO toDto(Repayment entity) {
        if (entity == null) {
            return null;
        }

        RepaymentDTO repaymentDTO = new RepaymentDTO();
        repaymentDTO.setId(entity.getId());
        repaymentDTO.setDate(entity.getDate());
        repaymentDTO.setAmount(entity.getAmount());
        repaymentDTO.setType(entity.getType());

        // Récupérer l'ID du crédit
        if (entity.getCredit() != null) {
            repaymentDTO.setCreditId(entity.getCredit().getId());
        }

        return repaymentDTO;
    }

    @Override
    public List<Repayment> toEntity(List<RepaymentDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<RepaymentDTO> toDto(List<Repayment> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
