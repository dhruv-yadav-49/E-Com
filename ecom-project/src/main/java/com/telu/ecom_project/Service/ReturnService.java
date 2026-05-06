package com.telu.ecom_project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.telu.ecom_project.model.ReturnRequest;
import com.telu.ecom_project.repo.ReturnRequestRepo;
import com.telu.ecom_project.repo.OrderRepo;
import com.telu.ecom_project.repo.ProductRepo;
import com.telu.ecom_project.model.Order;
import com.telu.ecom_project.model.OrderItem;
import com.telu.ecom_project.model.Product;


@Service
public class ReturnService {

    @Autowired
    private ReturnRequestRepo returnRepo;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductRepo productRepo;

    // 🔸 Submit a return request
    public ReturnRequest submitReturnRequest(Long orderId, String reason, String type, String userEmail) {
        ReturnRequest request = new ReturnRequest();
        request.setOrderId(orderId);
        request.setReason(reason);
        request.setType(type);
        request.setUserEmail(userEmail);
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());

        // 🔹 Set return window (e.g., 14 days after order date)
        request.setReturnWindowClosed(LocalDate.now().plusDays(14));

        return returnRepo.save(request);
    }

    public ReturnRequest updateStatus(Long id, String status){

        ReturnRequest req = returnRepo.findById(id).orElseThrow(() -> new RuntimeException("Return request not found"));
        req.setStatus(status);
        return returnRepo.save(req);
    }


    // 🔸 Get return requests for a user
    public List<ReturnRequest> getReturnsByUser(String userEmail) {
        return returnRepo.findByEmail(userEmail);
    }

    // 🔸 Approve a return request
    public ReturnRequest approveReturn(Long requestId, String note) {
        ReturnRequest request = returnRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Return request not found"));

        if (isReturnWindowClosed(request.getReturnWindowClosed())) {
            request.setStatus("REJECTED");
            request.setNote("Return window expired");
            return returnRepo.save(request);
        }

        request.setStatus("APPROVED");
        request.setNote(note);
        request.setResolvedAt(LocalDateTime.now());

        // 🔹 Add stock back if returned
        if ("REFUND".equals(request.getType())) {
            Order order = orderRepo.findById(request.getOrderId().intValue()).orElse(null);
            if (order != null && order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Product product = productRepo.findByName(item.getProductName());
                    if (product != null) {
                        product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                        productRepo.save(product);
                    }
                }
            }
        }

        return returnRepo.save(request);
    }

    // 🔸 Reject a return request
    public ReturnRequest rejectReturn(Long requestId, String note) {
        ReturnRequest request = returnRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Return request not found"));

        request.setStatus("REJECTED");
        request.setNote(note);
        request.setResolvedAt(LocalDateTime.now());

        return returnRepo.save(request);
    }

    // 🔸 Check if return window is closed
    public boolean isReturnWindowClosed(LocalDate returnWindow) {
        return returnWindow != null && returnWindow.isBefore(LocalDate.now());
    }

    // 🔸 Get pending return requests
    public List<ReturnRequest> getPendingReturns() {
        return returnRepo.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .toList();
    }

    // 🔸 Dashboard metrics
    public long getPendingReturnCount() {
        return returnRepo.countPendingReturns();
    }

    public long getResolvedReturnCount() {
        return returnRepo.countResolvedReturns();
    }
}

