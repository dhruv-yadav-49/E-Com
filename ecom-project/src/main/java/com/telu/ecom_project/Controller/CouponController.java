package com.telu.ecom_project.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.model.Coupon;
import com.telu.ecom_project.service.CouponService;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    // 🔹 User: apply coupon at checkout
    @PostMapping("/apply")
    public ResponseEntity<BigDecimal> applyCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal total) {
        return ResponseEntity.ok(couponService.applyCoupon(code, total));
    }

    // 🔹 Admin: create coupon
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    // 🔹 Admin: list all coupons
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    // 🔹 Admin: toggle active/inactive
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Coupon> toggleCoupon(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.toggleCoupon(id));
    }

    // 🔹 Admin: delete coupon
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok("Coupon deleted");
    }
}
