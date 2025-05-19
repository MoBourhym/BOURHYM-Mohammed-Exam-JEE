package com.bourhym.exambackend;

import com.bourhym.exambackend.entities.PersonalCredit;
import com.bourhym.exambackend.entities.*;
import com.bourhym.exambackend.enums.CreditStatus;
import com.bourhym.exambackend.enums.RepaymentType;
import com.bourhym.exambackend.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.bourhym.exambackend.entities.PersonalCredit;

import java.util.Date;

@SpringBootApplication
public class ExamBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExamBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(
            ClientRepository clientRepository,
            CreditRepository creditRepository,
            PersonalCreditRepository personalCreditRepository,
            ProfessionalCreditRepository professionalCreditRepository,
            RealEstateCreditRepository realEstateCreditRepository,
            RepaymentRepository repaymentRepository) {
        return args -> {
            System.out.println("================= DÉMARRAGE DE L'APPLICATION AVEC H2 =================");

            // Création de clients
            Client client1 = new Client();
            client1.setName("Jean Dupont");
            client1.setEmail("jean.dupont@example.com");

            Client client2 = new Client();
            client2.setName("Marie Martin");
            client2.setEmail("marie.martin@example.com");

            clientRepository.save(client1);
            clientRepository.save(client2);
            System.out.println("2 clients créés avec succès !");

            // Création d'un crédit personnel
            PersonalCredit personalCredit = new PersonalCredit();
            personalCredit.setRequestDate(new Date());
            personalCredit.setStatus(CreditStatus.ACCEPTED);
            personalCredit.setAcceptanceDate(new Date());
            personalCredit.setAmount(10000.0);
            personalCredit.setDuration(24); // 24 mois
            personalCredit.setInterestRate(5.5);
            personalCredit.setClient(client1);
            personalCreditRepository.save(personalCredit);

            // Création d'un crédit professionnel
            ProfessionalCredit professionalCredit = new ProfessionalCredit();
            professionalCredit.setRequestDate(new Date());
            professionalCredit.setStatus(CreditStatus.IN_PROGRESS);
            professionalCredit.setAmount(50000.0);
            professionalCredit.setDuration(60); // 60 mois
            professionalCredit.setInterestRate(4.2);
            professionalCredit.setClient(client2);
            professionalCreditRepository.save(professionalCredit);

            // Création d'un crédit immobilier
            RealEstateCredit realEstateCredit = new RealEstateCredit();
            realEstateCredit.setRequestDate(new Date());
            realEstateCredit.setStatus(CreditStatus.ACCEPTED);
            realEstateCredit.setAcceptanceDate(new Date());
            realEstateCredit.setAmount(200000.0);
            realEstateCredit.setDuration(240); // 240 mois (20 ans)
            realEstateCredit.setInterestRate(3.1);
            realEstateCredit.setClient(client1);
            realEstateCredit.setPropertyType(RealEstateCredit.PropertyType.APARTMENT);
            realEstateCreditRepository.save(realEstateCredit);

            System.out.println("3 crédits créés avec succès !");

            // Création de remboursements pour le crédit personnel
            Repayment repayment1 = new Repayment();
            repayment1.setDate(new Date());
            repayment1.setAmount(500.0);
            repayment1.setType(RepaymentType.MONTHLY_PAYMENT);
            repayment1.setCredit(personalCredit);
            repaymentRepository.save(repayment1);

            Repayment repayment2 = new Repayment();
            repayment2.setDate(new Date());
            repayment2.setAmount(2000.0);
            repayment2.setType(RepaymentType.EARLY_REPAYMENT);
            repayment2.setCredit(personalCredit);
            repaymentRepository.save(repayment2);

            System.out.println("2 remboursements créés avec succès !");

            // Test des requêtes personnalisées
            System.out.println("===== TEST DES REQUÊTES PERSONNALISÉES =====");

            System.out.println("Recherche de client par email :");
            clientRepository.findByEmail("jean.dupont@example.com")
                    .ifPresent(c -> System.out.println("Client trouvé : " + c.getName()));

            System.out.println("\nListe des crédits acceptés :");
            creditRepository.findByStatus(CreditStatus.ACCEPTED)
                    .forEach(c -> System.out.println("Crédit accepté ID: " + c.getId() + ", Montant: " + c.getAmount()));

            System.out.println("\nListe des crédits immobiliers de plus de 100000€ :");
            realEstateCreditRepository.findByAmountGreaterThan(100000.0)
                    .forEach(c -> System.out.println("Crédit immobilier ID: " + c.getId() +
                            ", Montant: " + c.getAmount() +
                            ", Type de propriété: " + c.getPropertyType()));

            System.out.println("\nRemboursements par type EARLY_REPAYMENT :");
            repaymentRepository.findByType(RepaymentType.EARLY_REPAYMENT)
                    .forEach(r -> System.out.println("Remboursement ID: " + r.getId() +
                            ", Montant: " + r.getAmount()));

            System.out.println("================= FIN DES TESTS =================");
        };
    }
}
