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
                "from", "ShopZen <onboarding@resend.dev>",
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
                "from", "ShopZen <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", "Login Alert - ShopZen",
                "html", "<p>Hello <b>" + userName + "</b>,</p>"
                        + "<p>You have successfully logged in to your ShopZen account.</p>"
                        + "<p>If this wasn't you, please reset your password immediately.</p>");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);
    }

    public void sendOrderStatusEmail(String toEmail, String userName, Integer orderId, String status) {
        RestTemplate rest = new RestTemplate();
        
        String subject = "Order Update: " + status;
        String htmlMessage = "<p>Hello <b>" + userName + "</b>,</p>" +
                             "<p>Your order <b>#" + orderId + "</b> is now: <b>" + status + "</b>.</p>" +
                             "<p>Thank you for shopping with ShopZen!</p>";

        if ("CONFIRMED".equalsIgnoreCase(status)) {
            subject = "Order Confirmed - ShopZen";
        } else if ("DELIVERED".equalsIgnoreCase(status)) {
            subject = "Your Order has been Delivered!";
        }

        Map<String, Object> body = Map.of(
                "from", "ShopZen <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", subject,
                "html", htmlMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);
    }

    public void sendReturnStatusEmail(String toEmail, Long orderId, String type, String status, String note) {
        RestTemplate rest = new RestTemplate();

        String typeLabel = "REFUND".equalsIgnoreCase(type) ? "Refund" : "Return/Exchange";
        String statusLabel = "APPROVED".equalsIgnoreCase(status) ? "Approved ✅" : "Rejected ❌";
        String subject = typeLabel + " " + statusLabel + " - ShopZen";

        String htmlMessage = "<p>Hello,</p>" +
                "<p>Your <b>" + typeLabel + "</b> request for order <b>#" + orderId + "</b> has been <b>" + statusLabel + "</b>.</p>" +
                (note != null && !note.isEmpty() ? "<p><b>Note:</b> " + note + "</p>" : "") +
                "<p>Thank you for shopping with ShopZen!</p>";

        Map<String, Object> body = Map.of(
                "from", "ShopZen <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", subject,
                "html", htmlMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);
    }

    public void sendEmail(String to, String subject, String body){

        SimpleMailMessage message = new SimpleMailMessage();


        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendNewsletterEmail(String toEmail, String subject, String content) {
        RestTemplate rest = new RestTemplate();

        Map<String, Object> body = Map.of(
                "from", "ShopZen <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", subject,
                "html", "<div>" + content + "</div><hr><p><small>You are receiving this because you subscribed to our newsletter. <a href='#'>Unsubscribe</a></small></p>");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);
    }

    public void sendRestockNotification(String toEmail, String productName) {
        RestTemplate rest = new RestTemplate();
        Map<String, Object> body = Map.of(
                "from", "ShopZen <onboarding@resend.dev>",
                "to", new String[] { toEmail },
                "subject", "Back in Stock: " + productName,
                "html", "<p>Hello,</p><p>Good news! <b>" + productName + "</b> is back in stock. Grab it before it's gone again!</p><p><a href='http://localhost:5173/'>Shop Now</a></p>");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(Objects.requireNonNull(resendApiKey));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        rest.exchange(RESEND_URL, Objects.requireNonNull(HttpMethod.POST), request, String.class);
    }
}
