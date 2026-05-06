package com.telu.ecom_project.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.telu.ecom_project.model.ReturnRequest;
import com.telu.ecom_project.service.ReturnService;

@RestController
@RequestMapping("/api/returns-request")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    // 🔸 Submit return request
    @PostMapping
    public ResponseEntity<ReturnRequest> submitReturn(
            @RequestParam Long orderId,
            @RequestParam String reason,
            @RequestParam String type,
            @RequestParam String userEmail) {
        return ResponseEntity.ok(returnService.submitReturnRequest(orderId, reason, type, userEmail));
    }

    @PutMapping("/admin/return/{id}")
    public ResponseEntity<ReturnRequest> updateStatus(
        @PathVariable Long id,
        @RequestParam String status
    ){
        return ResponseEntity.ok(returnService.updateStatus(id, status));
    }

    // 🔸 Get user's return requests
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserReturns(@PathVariable String email) {
        return ResponseEntity.ok(returnService.getReturnsByUser(email));
    }

    // 🔸 Approve return
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveReturn(@PathVariable Long id, @RequestParam String note) {
        return ResponseEntity.ok(returnService.approveReturn(id, note));
    }

    // 🔸 Reject return
    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectReturn(@PathVariable Long id, @RequestParam String note) {
        return ResponseEntity.ok(returnService.rejectReturn(id, note));
    }

    // 🔸 Get pending returns (for admin)
    @GetMapping("/pending")
    public ResponseEntity<?> getPending() {
        return ResponseEntity.ok(returnService.getPendingReturns());
    }
}

