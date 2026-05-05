package com.telu.ecom_project.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Coupon;
import com.telu.ecom_project.repo.CouponRepo;

@Service
@SuppressWarnings("null")
public class CouponService {

    @Autowired
    private CouponRepo couponRepo;

    // ── Apply coupon to a cart total ────────────────────────────
    public BigDecimal applyCoupon(String code, BigDecimal total) {

        Coupon coupon = couponRepo.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code: " + code));

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is inactive");
        }
        if (coupon.getEndDate() != null && coupon.getEndDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Coupon has expired");
        }
        if (coupon.getStartDate() != null && coupon.getStartDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Coupon is not yet valid");
        }
        if (coupon.getMinPurchaseAmount() != null &&
                total.compareTo(coupon.getMinPurchaseAmount()) < 0) {
            throw new RuntimeException("Minimum purchase of ₹" +
                    coupon.getMinPurchaseAmount() + " required");
        }

        BigDecimal discount = total.multiply(
                BigDecimal.valueOf(coupon.getDiscountPercentage() / 100.0));

        // Cap discount if maxDiscountAmount is set
        if (coupon.getMaxDiscountAmount() != null &&
                discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
            discount = coupon.getMaxDiscountAmount();
        }

        return total.subtract(discount).max(BigDecimal.ZERO);
    }

    // ── Admin: create coupon ─────────────────────────────────────
    public Coupon createCoupon(Coupon coupon) {
        if (couponRepo.findByCode(coupon.getCode()).isPresent()) {
            throw new RuntimeException("Coupon code already exists: " + coupon.getCode());
        }
        return couponRepo.save(coupon);
    }

    // ── Admin: get all coupons ───────────────────────────────────
    public List<Coupon> getAllCoupons() {
        return couponRepo.findAll();
    }

    // ── Admin: toggle active ─────────────────────────────────────
    public Coupon toggleCoupon(Long id) {
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setActive(!coupon.isActive());
        return couponRepo.save(coupon);
    }

    // ── Admin: delete coupon ─────────────────────────────────────
    public void deleteCoupon(Long id) {
        couponRepo.deleteById(id);
    }
}
