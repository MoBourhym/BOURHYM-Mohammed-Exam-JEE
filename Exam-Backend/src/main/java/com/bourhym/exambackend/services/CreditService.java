package com.bourhym.exambackend.services;

import com.bourhym.exambackend.dtos.CreditDTO;
import com.bourhym.exambackend.dtos.PersonalCreditDTO;
import com.bourhym.exambackend.dtos.ProfessionalCreditDTO;
import com.bourhym.exambackend.dtos.RealEstateCreditDTO;
import com.bourhym.exambackend.entities.*;
import com.bourhym.exambackend.enums.CreditStatus;
import com.bourhym.exambackend.exceptions.ResourceNotFoundException;
import com.bourhym.exambackend.mappers.*;
import com.bourhym.exambackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CreditService {

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private PersonalCreditRepository personalCreditRepository;

    @Autowired
    private ProfessionalCreditRepository professionalCreditRepository;

    @Autowired
    private RealEstateCreditRepository realEstateCreditRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CreditMapper creditMapper;

    @Autowired
    private PersonalCreditMapper personalCreditMapper;

    @Autowired
    private ProfessionalCreditMapper professionalCreditMapper;

    @Autowired
    private RealEstateCreditMapper realEstateCreditMapper;

    /**
     * Crée une demande de crédit personnel.
     *
     * @param creditDTO Les informations du crédit personnel
     * @return Le crédit créé avec son ID
     * @throws ResourceNotFoundException si le client n'existe pas
     */
    public PersonalCreditDTO createPersonalCredit(PersonalCreditDTO creditDTO) {
        if (creditDTO.getClientId() == null || !clientRepository.existsById(creditDTO.getClientId())) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + creditDTO.getClientId());
        }

        PersonalCredit credit = personalCreditMapper.toEntity(creditDTO);
        credit.setRequestDate(new Date());
        credit.setStatus(CreditStatus.IN_PROGRESS);

        credit = personalCreditRepository.save(credit);
        return personalCreditMapper.toDto(credit);
    }

    /**
     * Crée une demande de crédit professionnel.
     *
     * @param creditDTO Les informations du crédit professionnel
     * @return Le crédit créé avec son ID
     * @throws ResourceNotFoundException si le client n'existe pas
     */
    public ProfessionalCreditDTO createProfessionalCredit(ProfessionalCreditDTO creditDTO) {
        if (creditDTO.getClientId() == null || !clientRepository.existsById(creditDTO.getClientId())) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + creditDTO.getClientId());
        }

        ProfessionalCredit credit = professionalCreditMapper.toEntity(creditDTO);
        credit.setRequestDate(new Date());
        credit.setStatus(CreditStatus.IN_PROGRESS);

        credit = professionalCreditRepository.save(credit);
        return professionalCreditMapper.toDto(credit);
    }

    /**
     * Crée une demande de crédit immobilier.
     *
     * @param creditDTO Les informations du crédit immobilier
     * @return Le crédit créé avec son ID
     * @throws ResourceNotFoundException si le client n'existe pas
     */
    public RealEstateCreditDTO createRealEstateCredit(RealEstateCreditDTO creditDTO) {
        if (creditDTO.getClientId() == null || !clientRepository.existsById(creditDTO.getClientId())) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + creditDTO.getClientId());
        }

        RealEstateCredit credit = realEstateCreditMapper.toEntity(creditDTO);
        credit.setRequestDate(new Date());
        credit.setStatus(CreditStatus.IN_PROGRESS);

        credit = realEstateCreditRepository.save(credit);
        return realEstateCreditMapper.toDto(credit);
    }

    /**
     * Récupère tous les crédits.
     *
     * @return La liste de tous les crédits
     */
    @Transactional(readOnly = true)
    public List<CreditDTO> getAllCredits() {
        List<Credit> credits = creditRepository.findAll();
        return creditMapper.toDto(credits);
    }

    /**
     * Récupère un crédit par son ID.
     *
     * @param id L'ID du crédit
     * @return Le crédit correspondant ou empty si non trouvé
     */
    @Transactional(readOnly = true)
    public Optional<CreditDTO> getCreditById(Long id) {
        return creditRepository.findById(id)
                .map(creditMapper::toDto);
    }

    /**
     * Approuve un crédit.
     *
     * @param id L'ID du crédit à approuver
     * @return Le crédit mis à jour ou empty si non trouvé
     */
    public Optional<CreditDTO> approveCredit(Long id) {
        Optional<Credit> creditOptional = creditRepository.findById(id);
        if (!creditOptional.isPresent()) {
            return Optional.empty();
        }

        Credit credit = creditOptional.get();
        credit.setStatus(CreditStatus.ACCEPTED);
        credit.setAcceptanceDate(new Date());
        credit = creditRepository.save(credit);

        return Optional.of(creditMapper.toDto(credit));
    }

    /**
     * Rejette un crédit.
     *
     * @param id L'ID du crédit à rejeter
     * @return Le crédit mis à jour ou empty si non trouvé
     */
    public Optional<CreditDTO> rejectCredit(Long id) {
        Optional<Credit> creditOptional = creditRepository.findById(id);
        if (!creditOptional.isPresent()) {
            return Optional.empty();
        }

        Credit credit = creditOptional.get();
        credit.setStatus(CreditStatus.REJECTED);
        credit = creditRepository.save(credit);

        return Optional.of(creditMapper.toDto(credit));
    }

    /**
     * Récupère tous les crédits d'un client.
     *
     * @param clientId L'ID du client
     * @return La liste des crédits du client
     */
    @Transactional(readOnly = true)
    public List<CreditDTO> getCreditsByClient(Long clientId) {
        List<Credit> credits = creditRepository.findByClientId(clientId);
        return creditMapper.toDto(credits);
    }

    /**
     * Récupère tous les crédits par statut.
     *
     * @param status Le statut des crédits recherchés
     * @return La liste des crédits ayant ce statut
     */
    @Transactional(readOnly = true)
    public List<CreditDTO> getCreditsByStatus(CreditStatus status) {
        List<Credit> credits = creditRepository.findByStatus(status);
        return creditMapper.toDto(credits);
    }

    /**
     * Calcule le montant total des crédits acceptés.
     *
     * @return Le montant total
     */
    @Transactional(readOnly = true)
    public Double getTotalAmountOfAcceptedCredits() {
        List<Credit> acceptedCredits = creditRepository.findByStatus(CreditStatus.ACCEPTED);
        return acceptedCredits.stream()
                .mapToDouble(Credit::getAmount)
                .sum();
    }

    /**
     * Calcule le montant total des crédits par type et par statut.
     *
     * @param status Le statut des crédits à analyser
     * @return Une Map contenant les montants par type de crédit
     */
    @Transactional(readOnly = true)
    public CreditStatistics getCreditStatisticsByStatus(CreditStatus status) {
        List<Credit> credits = creditRepository.findByStatus(status);

        // Filtrer par type et calculer les sommes
        double personalAmount = credits.stream()
                .filter(c -> c instanceof PersonalCredit)
                .mapToDouble(Credit::getAmount)
                .sum();

        double professionalAmount = credits.stream()
                .filter(c -> c instanceof ProfessionalCredit)
                .mapToDouble(Credit::getAmount)
                .sum();

        double realEstateAmount = credits.stream()
                .filter(c -> c instanceof RealEstateCredit)
                .mapToDouble(Credit::getAmount)
                .sum();

        return new CreditStatistics(personalAmount, professionalAmount, realEstateAmount);
    }

    /**
     * Classe interne pour les statistiques de crédits.
     */
    public static class CreditStatistics {
        private final double personalCreditAmount;
        private final double professionalCreditAmount;
        private final double realEstateCreditAmount;
        private final double totalAmount;

        public CreditStatistics(double personalCreditAmount, double professionalCreditAmount, double realEstateCreditAmount) {
            this.personalCreditAmount = personalCreditAmount;
            this.professionalCreditAmount = professionalCreditAmount;
            this.realEstateCreditAmount = realEstateCreditAmount;
            this.totalAmount = personalCreditAmount + professionalCreditAmount + realEstateCreditAmount;
        }

        public double getPersonalCreditAmount() {
            return personalCreditAmount;
        }

        public double getProfessionalCreditAmount() {
            return professionalCreditAmount;
        }

        public double getRealEstateCreditAmount() {
            return realEstateCreditAmount;
        }

        public double getTotalAmount() {
            return totalAmount;
        }
    }
}
