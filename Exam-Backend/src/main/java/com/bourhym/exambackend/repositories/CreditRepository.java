package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.Credit;
import com.bourhym.exambackend.entities.Client;
import com.bourhym.exambackend.enums.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {
    // Rechercher des crédits par statut
    List<Credit> findByStatus(CreditStatus status);

    // Rechercher des crédits par client
    List<Credit> findByClient(Client client);
    List<Credit> findByClientId(Long clientId);

    // Rechercher des crédits par montant supérieur à une valeur
    List<Credit> findByAmountGreaterThan(Double amount);

    // Rechercher des crédits par date de demande entre deux dates
    List<Credit> findByRequestDateBetween(Date startDate, Date endDate);

    // Statistiques: nombre de crédits par statut
    @Query("SELECT c.status, COUNT(c) FROM Credit c GROUP BY c.status")
    List<Object[]> countByStatus();

    // Rechercher des crédits par statut et montant supérieur à une valeur
    List<Credit> findByStatusAndAmountGreaterThan(CreditStatus status, Double amount);
}
