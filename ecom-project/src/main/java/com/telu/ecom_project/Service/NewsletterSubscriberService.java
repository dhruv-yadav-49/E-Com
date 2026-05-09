package com.telu.ecom_project.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.NewsletterSubscriber;
import com.telu.ecom_project.repo.NewsletterSubscriberRepo;

@Service
public class NewsletterSubscriberService {
    
    @Autowired
    private NewsletterSubscriberRepo sub;

    @Autowired
    private EmailService emailService;

    public NewsletterSubscriber subscribe(String email){
        NewsletterSubscriber  subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        subscriber.setActive(true);
        subscriber.setSubscribedAt(LocalDateTime.now());

        return sub.save(subscriber);
    }

    public List<NewsletterSubscriber> getActiveSubscribers(){
        return sub.findByActiveTrue();
    }

    public void sendNewsletter(String subject, String content){
        List<NewsletterSubscriber> subscribers = getActiveSubscribers();

        for(NewsletterSubscriber subscriber : subscribers){
            try{
                emailService.sendNewsletterEmail(subscriber.getEmail(), subject, content);
            }
            catch (Exception e){
                System.err.println("Failed to send newsletter to " + subscriber.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void unsubscribe(String email){
        NewsletterSubscriber subscriber = sub.findByEmail(email);
        if (subscriber != null) {
            subscriber.setActive(false);
            sub.save(subscriber);
        }

    }

    
}
