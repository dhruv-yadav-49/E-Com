package com.telu.ecom_project.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Map<String, BigDecimal> monthlyRevenue;
    private Map<String, Long> salesByCategory;
    private Map<String, Long> newUsersByMonth;
}
