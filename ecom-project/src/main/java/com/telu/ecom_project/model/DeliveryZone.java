package com.telu.ecom_project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class DeliveryZone {
    
    @Id
    private String pincode;

    private Integer deliveryDays;
}
