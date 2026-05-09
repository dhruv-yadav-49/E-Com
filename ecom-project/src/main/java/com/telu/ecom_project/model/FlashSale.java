package com.telu.ecom_project.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Entity
@Data
public class FlashSale {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String discountDescription;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private boolean active;

    @ManyToMany
    private List<Product> products;

}
