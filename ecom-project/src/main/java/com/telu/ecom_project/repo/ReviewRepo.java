package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Review;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Integer> {

    List<Review> findByProductId(int productId);
    
}
