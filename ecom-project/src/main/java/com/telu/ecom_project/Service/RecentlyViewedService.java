package com.telu.ecom_project.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.model.RecentlyViewed;
import com.telu.ecom_project.repo.ProductRepo;
import com.telu.ecom_project.repo.RecentlyViewedRepo;

@Service
@SuppressWarnings("null")
public class RecentlyViewedService {

    @Autowired
    private RecentlyViewedRepo recentlyViewedRepo;
    
    @Autowired
    private ProductRepo productRepo;

    private static final int MAX_RECENT_ITEMS = 10;

    public void addProductToRecentlyViewed(String email, Integer productId) {
        
        Optional<RecentlyViewed> existing = recentlyViewedRepo.findByUserEmailAndProductId(email, productId);
        
        if (existing.isPresent()) {
            RecentlyViewed rv = existing.get();
            rv.setViewedAt(LocalDateTime.now());
            recentlyViewedRepo.save(rv);
            return;
        }

        // If not present, we might need to remove oldest if we hit the limit
        if (recentlyViewedRepo.countByUserEmail(email) >= MAX_RECENT_ITEMS) {
            RecentlyViewed oldest = recentlyViewedRepo.findFirstByUserEmailOrderByViewedAtAsc(email);
            if (oldest != null) {
                recentlyViewedRepo.delete(oldest);
            }
        }

        RecentlyViewed rv = new RecentlyViewed();
        rv.setUserEmail(email);
        rv.setProductId(productId);
        rv.setViewedAt(LocalDateTime.now());
        
        recentlyViewedRepo.save(rv);
    }

    public List<Product> getRecentlyViewedProducts(String email) {
        List<RecentlyViewed> recents = recentlyViewedRepo.findByUserEmailOrderByViewedAtDesc(email);
        List<Product> products = new ArrayList<>();
        
        for (RecentlyViewed rv : recents) {
            productRepo.findById(rv.getProductId()).ifPresent(products::add);
        }
        
        return products;
    }
}
