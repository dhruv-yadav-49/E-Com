package com.telu.ecom_project.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private Double discountPercentage;      // e.g. 10.0 = 10%

    private BigDecimal maxDiscountAmount;   // cap on discount

    private BigDecimal minPurchaseAmount;   // minimum order value to apply

    private LocalDate startDate;
    private LocalDate endDate;              // validity range

    private boolean active = true;
}
