package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    // Rechercher des clients par email (peut retourner plusieurs résultats)
    List<Client> findByEmail(String email);

    // Rechercher le premier client avec un email donné (en cas de doublons)
    Optional<Client> findFirstByEmail(String email);

    // Rechercher des clients dont le nom contient une chaîne de caractères (insensible à la casse)
    List<Client> findByNameContainingIgnoreCase(String name);

    // Vérifier si un client avec un email spécifique existe
    boolean existsByEmail(String email);
}
