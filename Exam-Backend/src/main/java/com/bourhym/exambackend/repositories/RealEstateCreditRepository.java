package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.RealEstateCredit;
import com.bourhym.exambackend.entities.RealEstateCredit.PropertyType;
import com.bourhym.exambackend.enums.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RealEstateCreditRepository extends JpaRepository<RealEstateCredit, Long> {
    // Méthode corrigée pour rechercher par type de propriété
    List<RealEstateCredit> findByPropertyType(PropertyType propertyType);

    // Méthode existante préservée
    List<RealEstateCredit> findByClientId(Long clientId);

    // Rechercher des crédits immobiliers par statut
    List<RealEstateCredit> findByStatus(CreditStatus status);

    // Rechercher des crédits immobiliers par durée supérieure à une valeur (pour les crédits à long terme)
    List<RealEstateCredit> findByDurationGreaterThan(Integer months);

    // Statistiques: taux d'intérêt moyen des crédits immobiliers
    @Query("SELECT AVG(r.interestRate) FROM RealEstateCredit r")
    Double findAverageInterestRate();

    // Rechercher des crédits immobiliers par montant supérieur à une valeur
    List<RealEstateCredit> findByAmountGreaterThan(Double amount);

    // Statistiques: durée moyenne des crédits immobiliers
    @Query("SELECT AVG(r.duration) FROM RealEstateCredit r")
    Double findAverageDuration();

    // Rechercher les crédits immobiliers avec le montant le plus élevé
    @Query("SELECT r FROM RealEstateCredit r WHERE r.amount = (SELECT MAX(rc.amount) FROM RealEstateCredit rc)")
    List<RealEstateCredit> findWithHighestAmount();
}
