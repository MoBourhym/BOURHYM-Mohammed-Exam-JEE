package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.ProfessionalCredit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessionalCreditRepository extends JpaRepository<ProfessionalCredit, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici
}
