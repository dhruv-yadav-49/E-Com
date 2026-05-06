package com.telu.ecom_project.dto;

import java.math.BigDecimal;
import java.util.List;

import com.telu.ecom_project.model.TopProduct;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {

    // Revenue & Orders
    private BigDecimal totalRevenue;
    private Long totalOrder;
    private Long totalUsers;

    // Product Stats
    private Long totalProducts;
    private Long outOfStockProducts;
    private Long lowStockProducts;

    // Order Status Breakdown
    private Long pendingOrders;
    private Long confirmedOrders;
    private Long deliveredOrders;

    // Lists
    private List<TopProduct> topProduct;
    private List<RecentOrderDto> recentOrders;
}
