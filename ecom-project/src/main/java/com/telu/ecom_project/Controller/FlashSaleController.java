package com.telu.ecom_project.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.model.FlashSale;
import com.telu.ecom_project.service.FlashSaleService;

@RestController
@RequestMapping("/api")
public class FlashSaleController {
    
    @Autowired
    private FlashSaleService flashSaleService;

    @GetMapping("/flash-sales")
    public ResponseEntity<List<FlashSale>> getActiveSales(){
        return ResponseEntity.ok(flashSaleService.getActiveSales());
    }

    @PostMapping("/admin/flash-sales")
    public ResponseEntity<FlashSale> createSale(@RequestBody FlashSale sale) {
        return ResponseEntity.ok(flashSaleService.createSale(sale));
    }

}
