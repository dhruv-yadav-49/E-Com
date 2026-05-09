package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.FlashSale;

@Repository
public interface FlashSaleRepo extends JpaRepository<FlashSale, Long> {
    
    @Query("""
    SELECT f FROM FlashSale f
    WHERE f.active = true
    AND CURRENT_TIMESTAMP BETWEEN f.startTime AND f.endTime
    """)
    List<FlashSale> getActiveSales();
}
