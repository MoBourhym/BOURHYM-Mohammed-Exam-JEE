package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.RealEstateCredit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RealEstateCreditRepository extends JpaRepository<RealEstateCredit, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici
}
