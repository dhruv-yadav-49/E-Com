package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.OrderItem;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {

    // 🔹 Top Selling Products
    @Query("""
            SELECT oi.productName, SUM(oi.quantity) as totalSold
            FROM OrderItem oi
            GROUP BY oi.productName
            ORDER BY totalSold DESC
            """)
    List<Object[]> getTopSellingProducts();
}
