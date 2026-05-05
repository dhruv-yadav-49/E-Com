package com.telu.ecom_project.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.RecentlyViewed;

@Repository
public interface RecentlyViewedRepo extends JpaRepository<RecentlyViewed, Long> {
    
    Optional<RecentlyViewed> findByUserEmailAndProductId(String userEmail, Integer productId);
    
    List<RecentlyViewed> findByUserEmailOrderByViewedAtDesc(String userEmail);
    
    long countByUserEmail(String userEmail);
    
    RecentlyViewed findFirstByUserEmailOrderByViewedAtAsc(String userEmail);
}
