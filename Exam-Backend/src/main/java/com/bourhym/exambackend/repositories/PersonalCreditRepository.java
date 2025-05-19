package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.PersonalCredit;
import com.bourhym.exambackend.enums.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PersonalCreditRepository extends JpaRepository<PersonalCredit, Long> {
    // Rechercher des crédits personnels par statut
    List<PersonalCredit> findByStatus(CreditStatus status);

    // Rechercher des crédits personnels par client
    List<PersonalCredit> findByClientId(Long clientId);

    // Statistiques: montant moyen des crédits personnels
    @Query("SELECT AVG(p.amount) FROM PersonalCredit p")
    Double findAverageAmount();

    // Rechercher des crédits personnels par taux d'intérêt inférieur à une valeur
    List<PersonalCredit> findByInterestRateLessThan(Double rate);

    // Rechercher des crédits personnels par durée (en mois)
    List<PersonalCredit> findByDuration(Integer duration);

    // Rechercher des crédits personnels par durée supérieure à une valeur
    List<PersonalCredit> findByDurationGreaterThan(Integer duration);
}
