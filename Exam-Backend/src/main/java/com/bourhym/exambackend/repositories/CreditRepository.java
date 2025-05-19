package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici
}
