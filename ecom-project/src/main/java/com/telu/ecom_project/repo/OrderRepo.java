package com.telu.ecom_project.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {

    List<Order> findByUserEmail(String email);

    // 🔹 Total Revenue
    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    BigDecimal getTotalRevenue();

    // 🔹 Total Orders
    @Query("SELECT COUNT(o) FROM Order o")
    Long getTotalOrders();

    // 🔹 Orders by status
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(String status);

    @Query(value = "SELECT DATE_FORMAT(created_at, '%b %Y') AS month, SUM(total_amount) " +
                   "FROM `order` WHERE status = 'DELIVERED' AND created_at >= :sixMonthsAgo " +
                   "GROUP BY DATE_FORMAT(created_at, '%b %Y'), YEAR(created_at), MONTH(created_at) " +
                   "ORDER BY YEAR(created_at), MONTH(created_at)", nativeQuery = true)
    List<Object[]> getMonthlyRevenue(@org.springframework.data.repository.query.Param("sixMonthsAgo") java.time.LocalDateTime sixMonthsAgo);

    // 🔹 Recent 5 orders
    @Query("SELECT o FROM Order o ORDER BY o.id DESC")
    List<Order> findRecentOrders(org.springframework.data.domain.Pageable pageable);
}
