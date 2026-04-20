package com.telu.ecom_project.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.model.Review;
import com.telu.ecom_project.repo.ProductRepo;
import com.telu.ecom_project.repo.ReviewRepo;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ProductRepo productRepo;

    public Review addReview(int productId, Review review){

        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Product product = productRepo.findById(productId).orElse(null);
        if(product == null) return null;

        review.setProduct(product);

        return reviewRepo.save(review);
    }

    public List<Review> getReviews(int productId){
        return reviewRepo.findByProductId(productId);
    }

    public double getAverageRating(int productId){

        List<Review> reviews = reviewRepo.findByProductId(productId);

        if(reviews.isEmpty()) return 0;

        double avg = reviews.stream()
            .mapToInt(Review::getRating)
            .average()
            .orElse(0);

        return avg;
    }
}
