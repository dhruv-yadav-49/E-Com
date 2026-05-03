package com.telu.ecom_project.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Cart;
import com.telu.ecom_project.model.CartItem;
import com.telu.ecom_project.model.Order;
import com.telu.ecom_project.model.OrderItem;
import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.repo.CartRepo;
import com.telu.ecom_project.repo.OrderRepo;
import com.telu.ecom_project.repo.ProductRepo;

import jakarta.transaction.Transactional;

@Service
public class OrderService {
    
    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductService productService; // For stock alerts

    @Autowired
    private EmailService emailService;

    @Transactional
    public Order createOrder(String email, String paymentMethod){

        Cart cart = cartRepo.findByUserEmail(email);

        if(cart == null || cart.getItems().isEmpty()){
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUserEmail(email);
        order.setStatus("PENDING_PAYMENT");   // 🔥 IMPORTANT
        order.setPaymentMethod(paymentMethod);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {

            Product p = ci.getProduct();

            if(p.getStockQuantity() < ci.getQuantity()){
                throw new RuntimeException("Insufficient stock for product: " + p.getName());
            }

            BigDecimal price = p.getFinalPrice();
            if (price == null) price = p.getPrice();

            OrderItem oi = new OrderItem();
            oi.setProductName(p.getName());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(price);
            oi.setOrder(order);

            total = total.add(price.multiply(BigDecimal.valueOf(ci.getQuantity())));
            orderItems.add(oi);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        return orderRepo.save(order);
    }
    
    @Transactional
    public void confirmOrder(Integer orderId){
        Objects.requireNonNull(orderId, "orderId must not be null");
        
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if(!order.getStatus().equals("PENDING_PAYMENT")){
            throw new RuntimeException("Invalid order state for confirmation");
        }

        Cart cart = cartRepo.findByUserEmail(order.getUserEmail());

        for(CartItem ci : cart.getItems()){

            Product p = ci.getProduct();

            if(p.getStockQuantity() < ci.getQuantity()){
                throw new RuntimeException("Stock issue for: " + p.getName());
            }

            p.setStockQuantity(p.getStockQuantity() - ci.getQuantity());
            productService.updateStockStatus(p);
            productService.checkStockAlert(p);

            productRepo.save(p);
        }

        order.setStatus("CONFIRMED");
        orderRepo.save(order);

        emailService.sendEmail(
            order.getUserEmail(),
            "Order Confirmed ✅",
            "Your order #" + order.getId() + " has been placed successfully!"
        );

        cart.getItems().clear();
        cartRepo.save(cart);
    }

    public List<Order> getOrdersByUserEmail(String email){
        return orderRepo.findByUserEmail(email);
    }
}
