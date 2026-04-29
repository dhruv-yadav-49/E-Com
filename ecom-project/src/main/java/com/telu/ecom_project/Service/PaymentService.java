package com.telu.ecom_project.service;

import java.math.BigDecimal;

import com.razorpay.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {
    
    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    public Order createOrder(BigDecimal amount) throws Exception {

        RazorpayClient client = new RazorpayClient(key, secret);

        org.json.JSONObject options = new org.json.JSONObject();
        options.put("amount", amount.multiply(new BigDecimal(100)));
        options.put("currency", "INR");
        options.put("receipt", "txn_123");

        return client.orders.create(options);
    }

    public boolean verifySignature(String signature, String orderId, String paymentId){
        try {
            Utils.verifySignature(orderId, signature, paymentId);
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
}
