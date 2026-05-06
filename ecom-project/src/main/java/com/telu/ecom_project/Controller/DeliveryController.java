package com.telu.ecom_project.Controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.model.DeliveryZone;
import com.telu.ecom_project.service.DeliveryService;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService service;

    @GetMapping("/delivery-estimate")
    public ResponseEntity<LocalDate> estimate(
            @RequestParam String pincode
    ){
        return ResponseEntity.ok(
                service.estimateDelivery(pincode)
        );
    }

    @PostMapping("/zone")
    public ResponseEntity<String> addZone(@RequestBody DeliveryZone zone){
        return ResponseEntity.ok(service.addZone(zone));
    }
}
