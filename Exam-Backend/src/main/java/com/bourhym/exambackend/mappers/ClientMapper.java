package com.bourhym.exambackend.mappers;

import com.bourhym.exambackend.dtos.ClientDTO;
import com.bourhym.exambackend.entities.Client;
import com.bourhym.exambackend.entities.Credit;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClientMapper implements EntityMapper<ClientDTO, Client> {

    @Override
    public Client toEntity(ClientDTO dto) {
        if (dto == null) {
            return null;
        }

        Client client = new Client();
        client.setId(dto.getId());
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        return client;
    }

    @Override
    public ClientDTO toDto(Client entity) {
        if (entity == null) {
            return null;
        }

        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setId(entity.getId());
        clientDTO.setName(entity.getName());
        clientDTO.setEmail(entity.getEmail());

        // Extraire les IDs des crédits si la liste n'est pas null
        if (entity.getCredits() != null) {
            clientDTO.setCreditIds(entity.getCredits().stream()
                    .map(Credit::getId)
                    .collect(Collectors.toList()));
        }

        return clientDTO;
    }

    @Override
    public List<Client> toEntity(List<ClientDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClientDTO> toDto(List<Client> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
