package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.OrderItem;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {

    // 🔹 Top Selling Products
    @Query("SELECT p.name, COUNT(oi.id) FROM OrderItem oi JOIN Product p ON oi.productName = p.name GROUP BY p.name ORDER BY COUNT(oi.id) DESC")
    List<Object[]> getTopSellingProducts();

    @Query(value = "SELECT c.name, SUM(oi.price * oi.quantity) FROM order_item oi " +
                   "JOIN product p ON oi.product_name = p.name " +
                   "JOIN category c ON p.category_id = c.id " +
                   "JOIN `order` o ON oi.order_id = o.id " +
                   "WHERE o.status = 'DELIVERED' " +
                   "GROUP BY c.name", nativeQuery = true)
    List<Object[]> getSalesByCategory();
}
