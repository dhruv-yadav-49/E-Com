package com.telu.ecom_project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendLowStockAlert(String productName){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("dhruvyadav.y49@gmail.com");
        message.setTo("dhruvyadav.y49@gmail.com");
        message.setSubject("Low Stock Alert");
        message.setText("Low stock alert for product: " + productName);
        mailSender.send(message);
    }
}
