package com.telu.ecom_project.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.telu.ecom_project.model.FlashSale;
import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.repo.FlashSaleRepo;
import com.telu.ecom_project.repo.ProductRepo;

@Service
public class FlashSaleService {
    
    @Autowired
    private FlashSaleRepo flashSaleRepo;

    @Autowired
    private ProductRepo productRepo;

    public List<FlashSale> getActiveSales(){
        return flashSaleRepo.getActiveSales();
    }

    @Transactional
    public FlashSale createSale(FlashSale sale) {
        FlashSale savedSale = flashSaleRepo.save(sale);
        if (sale.getDiscountPercentage() != null && sale.getProducts() != null) {
            for (Product p : sale.getProducts()) {
                productRepo.findById(p.getId()).ifPresent(product -> {
                    BigDecimal discount = product.getPrice().multiply(BigDecimal.valueOf(sale.getDiscountPercentage() / 100.0));
                    product.setFinalPrice(product.getPrice().subtract(discount));
                    product.setDiscountPercentage(sale.getDiscountPercentage());
                    product.setFlashSaleInitialStock(product.getStockQuantity());
                    productRepo.save(product);
                });
            }
        }
        return savedSale;
    }

    @Transactional
    public void deleteSale(Long id) {
        flashSaleRepo.findById(id).ifPresent(sale -> {
            if (sale.getProducts() != null) {
                for (Product p : sale.getProducts()) {
                    productRepo.findById(p.getId()).ifPresent(product -> {
                        product.setFinalPrice(product.getPrice());
                        product.setDiscountPercentage(0.0);
                        product.setFlashSaleInitialStock(null);
                        productRepo.save(product);
                    });
                }
            }
            flashSaleRepo.deleteById(id);
        });
    }

    public List<FlashSale> getAllSales() {
        return flashSaleRepo.findAll();
    }
}
