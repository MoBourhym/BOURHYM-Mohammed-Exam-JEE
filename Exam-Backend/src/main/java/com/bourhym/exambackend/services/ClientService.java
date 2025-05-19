package com.bourhym.exambackend.services;

import com.bourhym.exambackend.dtos.ClientDTO;
import com.bourhym.exambackend.entities.Client;
import com.bourhym.exambackend.mappers.ClientMapper;
import com.bourhym.exambackend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientMapper clientMapper;

    /**
     * Enregistre un nouveau client.
     *
     * @param clientDTO Les données du client à enregistrer
     * @return Le client enregistré avec son ID généré
     */
    public ClientDTO saveClient(ClientDTO clientDTO) {
        Client client = clientMapper.toEntity(clientDTO);
        client = clientRepository.save(client);
        return clientMapper.toDto(client);
    }

    /**
     * Récupère tous les clients.
     *
     * @return La liste de tous les clients
     */
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clientMapper.toDto(clients);
    }

    /**
     * Récupère un client par son ID.
     *
     * @param id L'ID du client à récupérer
     * @return Le client correspondant ou null s'il n'existe pas
     */
    @Transactional(readOnly = true)
    public Optional<ClientDTO> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(clientMapper::toDto);
    }

    /**
     * Récupère un client par son email.
     *
     * @param email L'email du client à rechercher
     * @return Le client correspondant ou null s'il n'existe pas
     */
    @Transactional(readOnly = true)
    public Optional<ClientDTO> getClientByEmail(String email) {
        return clientRepository.findFirstByEmail(email)
                .map(clientMapper::toDto);
    }

    /**
     * Récupère tous les clients avec un email spécifique.
     *
     * @param email L'email des clients à rechercher
     * @return Liste des clients ayant cet email
     */
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClientsByEmail(String email) {
        List<Client> clients = clientRepository.findByEmail(email);
        return clientMapper.toDto(clients);
    }

    /**
     * Recherche des clients par nom (recherche partielle, insensible à la casse).
     *
     * @param name Le nom ou partie du nom à rechercher
     * @return Liste des clients dont le nom contient le terme recherché
     */
    @Transactional(readOnly = true)
    public List<ClientDTO> searchClientsByName(String name) {
        List<Client> clients = clientRepository.findByNameContainingIgnoreCase(name);
        return clientMapper.toDto(clients);
    }

    /**
     * Met à jour les informations d'un client existant.
     *
     * @param clientDTO Les nouvelles données du client
     * @return Le client mis à jour, ou null si le client n'existe pas
     */
    public Optional<ClientDTO> updateClient(ClientDTO clientDTO) {
        if (clientDTO.getId() == null || !clientRepository.existsById(clientDTO.getId())) {
            return Optional.empty();
        }

        Client client = clientMapper.toEntity(clientDTO);
        client = clientRepository.save(client);
        return Optional.of(clientMapper.toDto(client));
    }

    /**
     * Supprime un client par son ID.
     *
     * @param id L'ID du client à supprimer
     * @return true si le client a été supprimé, false sinon
     */
    public boolean deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            return false;
        }

        clientRepository.deleteById(id);
        return true;
    }

    /**
     * Vérifie si un email est déjà utilisé par un client.
     *
     * @param email L'email à vérifier
     * @return true si l'email est déjà utilisé, false sinon
     */
    @Transactional(readOnly = true)
    public boolean isEmailAlreadyUsed(String email) {
        return clientRepository.existsByEmail(email);
    }
}
