package com.telu.ecom_project.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.telu.ecom_project.model.Waitlist;
import com.telu.ecom_project.repo.WaitlistRepo;

@Service
public class WaitlistService {
    
    @Autowired
    private WaitlistRepo waitlistRepo;

    @Autowired
    private EmailService emailService;

    public void addToWaitlist(Integer productId, String email) {
        Waitlist waitlist = new Waitlist();
        waitlist.setProductId(productId);
        waitlist.setEmail(email);
        waitlistRepo.save(waitlist);
    }

    public void notifyUsers(Integer productId, String productName) {
        List<Waitlist> list = waitlistRepo.findByProductIdAndNotifiedFalse(productId);
        for (Waitlist entry : list) {
            try {
                emailService.sendRestockNotification(entry.getEmail(), productName);
                entry.setNotified(true);
                waitlistRepo.save(entry);
            } catch (Exception e) {
                System.out.println("Failed to notify " + entry.getEmail());
            }
        }
    }
}
