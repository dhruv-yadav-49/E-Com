package com.telu.ecom_project.Controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.razorpay.Order;
import com.telu.ecom_project.response.ApiResponse;
import com.telu.ecom_project.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a Razorpay order.
     * Body: { "amount": 500.00 }
     */
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(@RequestBody Map<String, Object> body) {
        try {
            BigDecimal amount = new BigDecimal(body.get("amount").toString());
            Order order = paymentService.createOrder(amount);

            Map<String, Object> data = Map.of(
                "orderId",   order.get("id"),
                "amount",    order.get("amount"),
                "currency",  order.get("currency"),
                "receipt",   order.get("receipt"),
                "status",    order.get("status")
            );

            return ResponseEntity.ok(new ApiResponse<>(200, "Order created successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Failed to create order: " + e.getMessage(), null));
        }
    }

    /**
     * Verify Razorpay payment signature.
     * Body: { "orderId": "...", "paymentId": "...", "signature": "..." }
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(@RequestBody Map<String, String> body) {
        String orderId    = body.get("orderId");
        String paymentId  = body.get("paymentId");
        String signature  = body.get("signature");

        boolean valid = paymentService.verifySignature(signature, orderId, paymentId);

        if (valid) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Payment verified successfully", true));
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Invalid payment signature", false));
        }
    }
}
