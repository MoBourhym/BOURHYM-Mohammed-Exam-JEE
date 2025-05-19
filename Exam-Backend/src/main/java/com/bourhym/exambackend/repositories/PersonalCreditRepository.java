package com.bourhym.exambackend.repositories;

import com.banking.credit.entities.PersonalCredit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalCreditRepository extends JpaRepository<PersonalCredit, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici
}
