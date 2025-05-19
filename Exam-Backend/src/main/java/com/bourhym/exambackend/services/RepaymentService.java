package com.bourhym.exambackend.services;

import com.bourhym.exambackend.dtos.RepaymentDTO;
import com.bourhym.exambackend.entities.Credit;
import com.bourhym.exambackend.entities.Repayment;
import com.bourhym.exambackend.enums.CreditStatus;
import com.bourhym.exambackend.enums.RepaymentType;
import com.bourhym.exambackend.exceptions.ResourceNotFoundException;
import com.bourhym.exambackend.mappers.RepaymentMapper;
import com.bourhym.exambackend.repositories.CreditRepository;
import com.bourhym.exambackend.repositories.RepaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RepaymentService {

    @Autowired
    private RepaymentRepository repaymentRepository;

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private RepaymentMapper repaymentMapper;

    /**
     * Enregistre un nouveau remboursement mensuel pour un crédit.
     *
     * @param creditId L'ID du crédit concerné
     * @param amount Le montant du remboursement
     * @return Le remboursement créé
     * @throws ResourceNotFoundException si le crédit n'existe pas ou n'est pas accepté
     */
    public RepaymentDTO createMonthlyRepayment(Long creditId, Double amount) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new ResourceNotFoundException("Crédit non trouvé avec l'ID: " + creditId));

        if (credit.getStatus() != CreditStatus.ACCEPTED) {
            throw new IllegalStateException("Impossible d'effectuer un remboursement sur un crédit non accepté");
        }

        Repayment repayment = new Repayment();
        repayment.setDate(new Date());
        repayment.setAmount(amount);
        repayment.setType(RepaymentType.MONTHLY_PAYMENT);
        repayment.setCredit(credit);

        repayment = repaymentRepository.save(repayment);
        return repaymentMapper.toDto(repayment);
    }

    /**
     * Enregistre un remboursement anticipé pour un crédit.
     *
     * @param creditId L'ID du crédit concerné
     * @param amount Le montant du remboursement anticipé
     * @return Le remboursement créé
     * @throws ResourceNotFoundException si le crédit n'existe pas ou n'est pas accepté
     */
    public RepaymentDTO createEarlyRepayment(Long creditId, Double amount) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new ResourceNotFoundException("Crédit non trouvé avec l'ID: " + creditId));

        if (credit.getStatus() != CreditStatus.ACCEPTED) {
            throw new IllegalStateException("Impossible d'effectuer un remboursement sur un crédit non accepté");
        }

        Repayment repayment = new Repayment();
        repayment.setDate(new Date());
        repayment.setAmount(amount);
        repayment.setType(RepaymentType.EARLY_REPAYMENT);
        repayment.setCredit(credit);

        repayment = repaymentRepository.save(repayment);
        return repaymentMapper.toDto(repayment);
    }

    /**
     * Récupère tous les remboursements d'un crédit.
     *
     * @param creditId L'ID du crédit
     * @return La liste des remboursements du crédit
     */
    @Transactional(readOnly = true)
    public List<RepaymentDTO> getRepaymentsByCreditId(Long creditId) {
        if (!creditRepository.existsById(creditId)) {
            throw new ResourceNotFoundException("Crédit non trouvé avec l'ID: " + creditId);
        }

        List<Repayment> repayments = repaymentRepository.findByCreditId(creditId);
        return repaymentMapper.toDto(repayments);
    }

    /**
     * Récupère les remboursements par type.
     *
     * @param type Le type de remboursement
     * @return La liste des remboursements du type spécifié
     */
    @Transactional(readOnly = true)
    public List<RepaymentDTO> getRepaymentsByType(RepaymentType type) {
        List<Repayment> repayments = repaymentRepository.findByType(type);
        return repaymentMapper.toDto(repayments);
    }

    /**
     * Calcule le montant total remboursé pour un crédit.
     *
     * @param creditId L'ID du crédit
     * @return Le montant total remboursé
     * @throws ResourceNotFoundException si le crédit n'existe pas
     */
    @Transactional(readOnly = true)
    public Double calculateTotalRepaidAmount(Long creditId) {
        if (!creditRepository.existsById(creditId)) {
            throw new ResourceNotFoundException("Crédit non trouvé avec l'ID: " + creditId);
        }

        Double totalAmount = repaymentRepository.sumAmountByCreditId(creditId);
        return totalAmount != null ? totalAmount : 0.0;
    }

    /**
     * Calcule le montant restant à payer pour un crédit.
     *
     * @param creditId L'ID du crédit
     * @return Le montant restant à payer
     * @throws ResourceNotFoundException si le crédit n'existe pas
     */
    @Transactional(readOnly = true)
    public Double calculateRemainingAmount(Long creditId) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new ResourceNotFoundException("Crédit non trouvé avec l'ID: " + creditId));

        Double totalRepaid = repaymentRepository.sumAmountByCreditId(creditId);
        if (totalRepaid == null) {
            totalRepaid = 0.0;
        }

        // Calcul approximatif du montant total à rembourser (principal + intérêts)
        double totalCreditAmount = credit.getAmount();
        // Un calcul plus précis tiendrait compte des intérêts composés
        double estimatedTotalWithInterest = totalCreditAmount * (1 + (credit.getInterestRate() * credit.getDuration() / 12) / 100);

        return Math.max(0, estimatedTotalWithInterest - totalRepaid);
    }

    /**
     * Supprime un remboursement.
     *
     * @param id L'ID du remboursement à supprimer
     * @return true si le remboursement a été supprimé, false sinon
     */
    public boolean deleteRepayment(Long id) {
        if (!repaymentRepository.existsById(id)) {
            return false;
        }

        repaymentRepository.deleteById(id);
        return true;
    }
}
