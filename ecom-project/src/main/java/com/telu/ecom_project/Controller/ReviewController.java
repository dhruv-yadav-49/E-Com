package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import jakarta.validation.Valid;
import java.util.List;

import com.telu.ecom_project.model.Review;
import com.telu.ecom_project.service.ReviewService;

@RestController
@RequestMapping("/api")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/product/{id}/review")
    public ResponseEntity<?> addReview(@PathVariable int id, @Valid @RequestBody Review review){

        Review saved = reviewService.addReview(id, review);

        if(saved != null)
            return ResponseEntity.ok(saved);
        else
            return ResponseEntity.badRequest().body("Product not found");
    }

    @GetMapping("/product/{id}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable int id){
        return ResponseEntity.ok(reviewService.getReviews(id));
    }

    @GetMapping("/product/{id}/avg-rating")
    public ResponseEntity<Double> getAvgRating(@PathVariable int id){
        return ResponseEntity.ok(reviewService.getAverageRating(id));
    }

}
