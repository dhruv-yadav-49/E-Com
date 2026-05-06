package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.telu.ecom_project.model.DeliveryZone;

public interface DeliveryZoneRepo extends JpaRepository<DeliveryZone, String> {

    public DeliveryZone findByPincode(String pincode);
}
