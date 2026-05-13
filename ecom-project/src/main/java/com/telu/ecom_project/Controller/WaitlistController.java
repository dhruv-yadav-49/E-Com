package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.telu.ecom_project.service.WaitlistService;

@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {

    @Autowired
    private WaitlistService waitlistService;

    @PostMapping("/add")
    public ResponseEntity<String> addToWaitlist(@RequestParam Integer productId, @RequestParam String email) {
        waitlistService.addToWaitlist(productId, email);
        return ResponseEntity.ok("You will be notified when the product is back in stock!");
    }
}
