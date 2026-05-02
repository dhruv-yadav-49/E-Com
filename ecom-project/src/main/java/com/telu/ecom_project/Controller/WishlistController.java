package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.telu.ecom_project.model.Wishlist;
import com.telu.ecom_project.response.ApiResponse;
import com.telu.ecom_project.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin("*")
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> addToWishlist(@PathVariable int productId, @RequestParam String userEmail){
        Wishlist wishlist = wishlistService.addToWishlist(userEmail, productId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Product added to wishlist successfully", wishlist));
    }

    @GetMapping("/get")
    public ResponseEntity<ApiResponse<Wishlist>> getWishlist(@RequestParam String userEmail){
        Wishlist wishlist = wishlistService.gettWishlist(userEmail);
        return ResponseEntity.ok(new ApiResponse<>(200, "Wishlist fetched successfully", wishlist));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> removeFromWishlist(@PathVariable int productId, @RequestParam String userEmail){
        Wishlist wishlist = wishlistService.removeFromWishlist(userEmail, productId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Product removed from wishlist successfully", wishlist));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Wishlist>> clearWishlist(@RequestParam String userEmail){
        Wishlist wishlist = wishlistService.clearWishlist(userEmail);
        return ResponseEntity.ok(new ApiResponse<>(200, "Wishlist cleared successfully", wishlist));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Integer>> countWishlist(@RequestParam String userEmail){
        int count = wishlistService.countWishlist(userEmail);
        return ResponseEntity.ok(new ApiResponse<>(200, "Wishlist count fetched successfully", count));
    }

    @PostMapping("/move-to-cart/{productId}")
    public ResponseEntity<ApiResponse<String>> moveToCart(
        @PathVariable int productId,
        @RequestParam String userEmail){
            String result = wishlistService.moveToCart(userEmail, productId);
            return ResponseEntity.ok(new ApiResponse<>(200, result, result));
    }


}
