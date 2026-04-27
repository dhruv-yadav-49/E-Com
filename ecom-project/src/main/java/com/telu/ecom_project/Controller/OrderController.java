package com.telu.ecom_project.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.dto.OrderRequest;
import com.telu.ecom_project.model.Order;
import com.telu.ecom_project.service.OrderService;

@RestController
@RequestMapping("/api/order")
@CrossOrigin("*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request){
        return ResponseEntity.ok(orderService.placeOrder(request.getEmail(), request.getPaymentMethod()));
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable String email){
        return ResponseEntity.ok(orderService.getOrdersByUserEmail(email));
    }
}
