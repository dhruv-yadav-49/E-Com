package com.telu.ecom_project.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Banner {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;

    private String subtitle;

    private String imageUrl;

    private boolean active;

    private LocalDate validFrom;

    private LocalDate validUntil;

    private String buttonUrl;

    private String buttonText;
    
}
