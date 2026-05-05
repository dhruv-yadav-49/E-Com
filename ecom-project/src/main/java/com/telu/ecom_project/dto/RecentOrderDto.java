package com.telu.ecom_project.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentOrderDto {
    private Integer id;
    private String userEmail;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
}
