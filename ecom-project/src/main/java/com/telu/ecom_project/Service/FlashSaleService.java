package com.telu.ecom_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.FlashSale;
import com.telu.ecom_project.repo.FlashSaleRepo;

@Service
public class FlashSaleService {
    
    @Autowired
    private FlashSaleRepo flashSaleRepo;

    public List<FlashSale> getActiveSales(){
        return flashSaleRepo.getActiveSales();
    }

    public FlashSale createSale(FlashSale sale) {
        return flashSaleRepo.save(sale);
    }
}
