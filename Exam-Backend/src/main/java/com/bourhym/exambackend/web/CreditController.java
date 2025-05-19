package com.bourhym.exambackend.web;

import com.bourhym.exambackend.dtos.CreditDTO;
import com.bourhym.exambackend.dtos.PersonalCreditDTO;
import com.bourhym.exambackend.dtos.ProfessionalCreditDTO;
import com.bourhym.exambackend.dtos.RealEstateCreditDTO;
import com.bourhym.exambackend.enums.CreditStatus;
import com.bourhym.exambackend.exceptions.ResourceNotFoundException;
import com.bourhym.exambackend.services.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
@CrossOrigin("*")
public class CreditController {

    @Autowired
    private CreditService creditService;

    @GetMapping
    public ResponseEntity<List<CreditDTO>> getAllCredits() {
        return ResponseEntity.ok(creditService.getAllCredits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreditDTO> getCreditById(@PathVariable Long id) {
        return creditService.getCreditById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/personal")
    public ResponseEntity<?> createPersonalCredit(@RequestBody PersonalCreditDTO creditDTO) {
        try {
            PersonalCreditDTO savedCredit = creditService.createPersonalCredit(creditDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCredit);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/professional")
    public ResponseEntity<?> createProfessionalCredit(@RequestBody ProfessionalCreditDTO creditDTO) {
        try {
            ProfessionalCreditDTO savedCredit = creditService.createProfessionalCredit(creditDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCredit);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/real-estate")
    public ResponseEntity<?> createRealEstateCredit(@RequestBody RealEstateCreditDTO creditDTO) {
        try {
            RealEstateCreditDTO savedCredit = creditService.createRealEstateCredit(creditDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCredit);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<CreditDTO> approveCredit(@PathVariable Long id) {
        return creditService.approveCredit(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<CreditDTO> rejectCredit(@PathVariable Long id) {
        return creditService.rejectCredit(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CreditDTO>> getCreditsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(creditService.getCreditsByClient(clientId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CreditDTO>> getCreditsByStatus(@PathVariable CreditStatus status) {
        return ResponseEntity.ok(creditService.getCreditsByStatus(status));
    }

    @GetMapping("/statistics/total-accepted")
    public ResponseEntity<Double> getTotalAmountOfAcceptedCredits() {
        return ResponseEntity.ok(creditService.getTotalAmountOfAcceptedCredits());
    }

    @GetMapping("/statistics/by-status/{status}")
    public ResponseEntity<CreditService.CreditStatistics> getCreditStatisticsByStatus(@PathVariable CreditStatus status) {
        return ResponseEntity.ok(creditService.getCreditStatisticsByStatus(status));
    }
}
