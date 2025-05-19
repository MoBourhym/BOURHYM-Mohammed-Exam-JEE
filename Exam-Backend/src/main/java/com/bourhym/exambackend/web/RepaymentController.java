package com.bourhym.exambackend.web;

import com.bourhym.exambackend.dtos.RepaymentDTO;
import com.bourhym.exambackend.enums.RepaymentType;
import com.bourhym.exambackend.exceptions.ResourceNotFoundException;
import com.bourhym.exambackend.services.RepaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repayments")
@CrossOrigin("*")
public class RepaymentController {

    @Autowired
    private RepaymentService repaymentService;

    @PostMapping("/monthly")
    public ResponseEntity<?> createMonthlyRepayment(
            @RequestParam Long creditId,
            @RequestParam Double amount) {
        try {
            RepaymentDTO repaymentDTO = repaymentService.createMonthlyRepayment(creditId, amount);
            return ResponseEntity.status(HttpStatus.CREATED).body(repaymentDTO);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/early")
    public ResponseEntity<?> createEarlyRepayment(
            @RequestParam Long creditId,
            @RequestParam Double amount) {
        try {
            RepaymentDTO repaymentDTO = repaymentService.createEarlyRepayment(creditId, amount);
            return ResponseEntity.status(HttpStatus.CREATED).body(repaymentDTO);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/credit/{creditId}")
    public ResponseEntity<?> getRepaymentsByCreditId(@PathVariable Long creditId) {
        try {
            List<RepaymentDTO> repayments = repaymentService.getRepaymentsByCreditId(creditId);
            return ResponseEntity.ok(repayments);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<RepaymentDTO>> getRepaymentsByType(@PathVariable RepaymentType type) {
        return ResponseEntity.ok(repaymentService.getRepaymentsByType(type));
    }

    @GetMapping("/total/{creditId}")
    public ResponseEntity<?> calculateTotalRepaidAmount(@PathVariable Long creditId) {
        try {
            Double total = repaymentService.calculateTotalRepaidAmount(creditId);
            return ResponseEntity.ok(Map.of("creditId", creditId, "totalRepaid", total));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/remaining/{creditId}")
    public ResponseEntity<?> calculateRemainingAmount(@PathVariable Long creditId) {
        try {
            Double remaining = repaymentService.calculateRemainingAmount(creditId);
            return ResponseEntity.ok(Map.of(
                "creditId", creditId,
                "remainingAmount", remaining
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepayment(@PathVariable Long id) {
        boolean deleted = repaymentService.deleteRepayment(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
