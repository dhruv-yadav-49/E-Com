package com.telu.ecom_project.model;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String description;
    private String brand;
    private BigDecimal price;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String releaseDate;
    private boolean productAvailable;
    private int stockQuantity;

    private String imageName;
    private String imageType;

    private boolean lowStock;


    private Double discountPercentage;
    private BigDecimal discountAmount;


    private BigDecimal finalPrice;

    @Lob
    private byte[] imageData;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews;

}