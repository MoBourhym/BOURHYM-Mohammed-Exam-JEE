package com.bourhym.exambackend.repositories;

import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.entities.Credit;
import com.bourhym.exambackend.enums.RepaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    // Rechercher des remboursements par crédit
    List<Repayment> findByCreditId(Long creditId);
    List<Repayment> findByCredit(Credit credit);

    // Rechercher des remboursements par type (mensuel ou anticipé)
    List<Repayment> findByType(RepaymentType type);

    // Rechercher des remboursements entre deux dates
    List<Repayment> findByDateBetween(Date startDate, Date endDate);

    // Rechercher des remboursements après une date spécifique
    List<Repayment> findByDateAfter(Date date);

    // Rechercher des remboursements par montant supérieur à une valeur
    List<Repayment> findByAmountGreaterThan(Double amount);

    // Statistiques: montant total des remboursements pour un crédit spécifique
    @Query("SELECT SUM(r.amount) FROM Repayment r WHERE r.credit.id = :creditId")
    Double sumAmountByCreditId(Long creditId);

    // Statistiques: montant total des remboursements par type
    @Query("SELECT r.type, SUM(r.amount) FROM Repayment r GROUP BY r.type")
    List<Object[]> sumAmountByType();

    // Rechercher des remboursements par crédit et type
    List<Repayment> findByCreditIdAndType(Long creditId, RepaymentType type);
}
