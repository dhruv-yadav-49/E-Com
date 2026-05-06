package com.telu.ecom_project.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.dto.DashboardStats;
import com.telu.ecom_project.dto.RecentOrderDto;
import com.telu.ecom_project.model.TopProduct;
import com.telu.ecom_project.repo.OrderItemRepo;
import com.telu.ecom_project.repo.OrderRepo;
import com.telu.ecom_project.repo.ProductRepo;
import com.telu.ecom_project.repo.UserRepo;

@Service
public class AdminService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private ProductRepo productRepo;

    public DashboardStats getDashboardStats() {

        // Revenue & Orders
        BigDecimal totalRevenue = orderRepo.getTotalRevenue();
        Long totalOrders        = orderRepo.getTotalOrders();
        Long totalUsers         = userRepo.getActiveUsers();

        // Product stats
        Long totalProducts    = productRepo.getTotalProducts();
        Long outOfStock       = productRepo.getOutOfStockCount();
        Long lowStock         = productRepo.getLowStockCount();

        // Order status breakdown
        Long pendingOrders   = orderRepo.countByStatus("PENDING");
        Long confirmedOrders = orderRepo.countByStatus("CONFIRMED");
        Long deliveredOrders = orderRepo.countByStatus("DELIVERED");

        // Top selling products
        List<Object[]> rawTopProducts = orderItemRepo.getTopSellingProducts();
        List<TopProduct> topProducts = rawTopProducts.stream()
                .map(row -> new TopProduct((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        // Recent 5 orders
        List<RecentOrderDto> recentOrders = orderRepo
                .findRecentOrders(PageRequest.of(0, 5))
                .stream()
                .map(o -> new RecentOrderDto(
                        o.getId(),
                        o.getUserEmail(),
                        o.getTotalAmount(),
                        o.getStatus(),
                        o.getPaymentMethod()))
                .collect(Collectors.toList());

        return new DashboardStats(
                totalRevenue,
                totalOrders,
                totalUsers,
                totalProducts,
                outOfStock,
                lowStock,
                pendingOrders,
                confirmedOrders,
                deliveredOrders,
                topProducts,
                recentOrders);
    }

    public com.telu.ecom_project.dto.AnalyticsResponse getAnalytics() {
        java.time.LocalDateTime sixMonthsAgo = java.time.LocalDateTime.now().minusMonths(6);
        
        java.util.List<Object[]> monthlyRevRaw = orderRepo.getMonthlyRevenue(sixMonthsAgo);
        java.util.Map<String, BigDecimal> monthlyRevenue = new java.util.LinkedHashMap<>();
        for (Object[] row : monthlyRevRaw) {
            monthlyRevenue.put((String) row[0], new BigDecimal(row[1].toString()));
        }

        java.util.List<Object[]> salesCatRaw = orderItemRepo.getSalesByCategory();
        java.util.Map<String, Long> salesByCategory = new java.util.LinkedHashMap<>();
        for (Object[] row : salesCatRaw) {
            salesByCategory.put((String) row[0], new BigDecimal(row[1].toString()).longValue());
        }

        java.util.List<Object[]> usersRaw = userRepo.getNewUsersByMonth(sixMonthsAgo);
        java.util.Map<String, Long> newUsersByMonth = new java.util.LinkedHashMap<>();
        for (Object[] row : usersRaw) {
            newUsersByMonth.put((String) row[0], ((Number) row[1]).longValue());
        }

        return new com.telu.ecom_project.dto.AnalyticsResponse(monthlyRevenue, salesByCategory, newUsersByMonth);
    }
}
