package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.ProfessionalCredit;
import com.bourhym.exambackend.enums.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Date;

@Repository
public interface ProfessionalCreditRepository extends JpaRepository<ProfessionalCredit, Long> {
    // Rechercher des crédits professionnels par statut
    List<ProfessionalCredit> findByStatus(CreditStatus status);

    // Rechercher des crédits professionnels par client
    List<ProfessionalCredit> findByClientId(Long clientId);

    // Rechercher des crédits professionnels par montant entre deux valeurs
    List<ProfessionalCredit> findByAmountBetween(Double minAmount, Double maxAmount);

    // Statistiques: montant total des crédits professionnels acceptés
    @Query("SELECT SUM(p.amount) FROM ProfessionalCredit p WHERE p.status = 'ACCEPTED'")
    Double sumAmountOfAcceptedCredits();

    // Rechercher des crédits professionnels par date d'acceptation
    List<ProfessionalCredit> findByAcceptanceDate(Date acceptanceDate);

    // Rechercher des crédits professionnels par taux d'intérêt entre deux valeurs
    List<ProfessionalCredit> findByInterestRateBetween(Double minRate, Double maxRate);
}
