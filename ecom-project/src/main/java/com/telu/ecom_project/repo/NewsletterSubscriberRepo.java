package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.NewsletterSubscriber;

@Repository
public interface NewsletterSubscriberRepo extends JpaRepository<NewsletterSubscriber, Long> {
    
    List<NewsletterSubscriber> findByActiveTrue();
    NewsletterSubscriber findByEmail(String email);
}
