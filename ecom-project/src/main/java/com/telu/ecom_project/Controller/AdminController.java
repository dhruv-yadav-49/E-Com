package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.dto.DashboardStats;
import com.telu.ecom_project.model.Order;
import com.telu.ecom_project.service.AdminService;
import com.telu.ecom_project.service.OrderService;
import com.telu.ecom_project.service.ReviewService;
import com.telu.ecom_project.serviceInterface.IUserService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private IUserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewService reviewService;

    // 🔹 Get Dashboard Stats
    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStats> getDashboard(){
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // 🔹 Get Analytics Charts Data
    @GetMapping("/analytics")
    public ResponseEntity<com.telu.ecom_project.dto.AnalyticsResponse> getAnalyticsData() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    // 🔹 USER MANAGEMENT

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        var response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Activate / Deactivate user
    @PutMapping("/users/{userId}/toggle")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        var response = userService.toggleUserStatus(userId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Change role (ADMIN / USER)
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> changeRole(
            @PathVariable Long userId,
            @RequestParam String role) {
        var response = userService.updateUserRole(userId, role);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Update Order Status (PENDING → CONFIRMED → DELIVERED / CANCELLED)
    @PutMapping("/order/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // 🔹 REVIEW MODERATION

    // Delete any review (admin only)
    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Integer reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review #" + reviewId + " deleted successfully");
    }

    // List all reviews for a product (for moderation view)
    @GetMapping("/product/{productId}/reviews")
    public ResponseEntity<?> getProductReviews(@PathVariable int productId) {
        return ResponseEntity.ok(reviewService.getAllReviewsForProduct(productId));
    }

}
