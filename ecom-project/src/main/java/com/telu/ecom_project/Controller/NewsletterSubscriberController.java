package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.service.NewsletterSubscriberService;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterSubscriberController {
    
    @Autowired
    private NewsletterSubscriberService service;

    @PostMapping("/subscribe")
    public void subscribe(@RequestParam String email){
        service.subscribe(email);
    }

    @GetMapping("/unsubscribe")
    public String unsubscribe(@RequestParam String email){
        service.unsubscribe(email);
        return "Unsubscribed successfully";
    }

    @PostMapping("/admin/send")
    public void sendNewsletter(@RequestParam String subject, @RequestParam String content){
        service.sendNewsletter(subject, content);
    }
}
