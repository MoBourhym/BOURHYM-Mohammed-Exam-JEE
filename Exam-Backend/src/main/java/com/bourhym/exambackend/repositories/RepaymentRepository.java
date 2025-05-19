package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici
}
