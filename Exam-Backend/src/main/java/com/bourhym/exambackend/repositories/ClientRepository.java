package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici
}
