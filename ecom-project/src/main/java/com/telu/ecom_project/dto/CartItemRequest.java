package com.telu.ecom_project.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private String email;
    private Integer productId;
    private Integer quantity;
}
