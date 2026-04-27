package com.telu.ecom_project.service;

import org.springframework.beans.factory.annotation.Value;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

        @Value("${resend.api.key}")
    private String resendApiKey;

    private static final String RESEND_URL = "https://api.resend.com/emails";

    public void sendEmailVerificationLink(String toEmail, String verificationLink) {

        RestTemplate rest = new RestTemplate();

        Map<String, Object> body = Map.of(
                "from", "AaoStays <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", "Verify your email",
                "html", "<p>Click below to verify:</p><a href=\"" + verificationLink + "\">Verify Email</a>");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);

    }

    public void sendLoginNotification(String toEmail, String userName) {

        RestTemplate rest = new RestTemplate();

        Map<String, Object> body = Map.of(
                "from", "AaoStays <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", "Login Alert - AaoStays",
                "html", "<p>Hello <b>" + userName + "</b>,</p>"
                        + "<p>You have successfully logged in to your AaoStays account.</p>"
                        + "<p>If this wasn't you, please reset your password immediately.</p>");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);
    }
}
