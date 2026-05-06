package com.telu.ecom_project.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "return_requests")
@Data
public class ReturnRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String reason;

    private String status;

    private LocalDateTime requestedAt;

    private String userEmail;

    private String type;

    private LocalDate returnWindowClosed;

    private LocalDateTime resolvedAt;

    private String note;

}
