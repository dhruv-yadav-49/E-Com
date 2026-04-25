package com.telu.ecom_project.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String email;
    private String paymentMethod;
}
