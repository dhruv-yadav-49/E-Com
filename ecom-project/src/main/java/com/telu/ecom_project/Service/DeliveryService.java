package com.telu.ecom_project.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.DeliveryZone;
import com.telu.ecom_project.repo.DeliveryZoneRepo;

@Service
@SuppressWarnings("null")
public class DeliveryService {

    @Autowired
    private DeliveryZoneRepo repo;

    public LocalDate estimateDelivery(String pincode){

        DeliveryZone zone =
                repo.findById(pincode)
                .orElseThrow(() ->
                        new RuntimeException("Invalid pincode"));

        return LocalDate.now()
                .plusDays(zone.getDeliveryDays());
    }

    public String addZone(DeliveryZone zone){
        repo.save(zone);
        return "Zone added successfully ✔";
    }
}
