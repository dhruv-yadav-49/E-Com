package com.telu.ecom_project.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.service.RecentlyViewedService;

@RestController
@RequestMapping("/api/recently-viewed")
public class RecentlyViewedController {

    @Autowired
    private RecentlyViewedService recentlyViewedService;

    @PostMapping("/{productId}")
    public ResponseEntity<String> addRecentlyViewed(@PathVariable Integer productId, Authentication auth) {
        recentlyViewedService.addProductToRecentlyViewed(auth.getName(), productId);
        return ResponseEntity.ok("Product added to recently viewed");
    }

    @GetMapping
    public ResponseEntity<List<Product>> getRecentlyViewed(Authentication auth) {
        return ResponseEntity.ok(recentlyViewedService.getRecentlyViewedProducts(auth.getName()));
    }
}
