package com.telu.ecom_project.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public Order placeOrder(String email, String paymentMethod){

        Cart cart = cartRepo.findByUserEmail(email);

        if(cart == null || cart.getItems().isEmpty()){
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUserEmail(email);
        order.setStatus("CREATED");
        order.setPaymentMethod(paymentMethod);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()){
            Product p = ci.getProduct();

            if(p.getStockQuantity() < ci.getQuantity()){
                throw new RuntimeException("Insufficient stock for product: " + p.getName());
            }

            // Deduct stock
            p.setStockQuantity(p.getStockQuantity() - ci.getQuantity());
            
            // Trigger stock alerts if needed
            productService.updateStockStatus(p);
            productService.checkStockAlert(p);

            BigDecimal price = p.getFinalPrice();
            if (price == null) price = p.getPrice();

            OrderItem oi = new OrderItem();
            oi.setProductName(p.getName());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(price);
            oi.setOrder(order);

            total = total.add(price.multiply(BigDecimal.valueOf(ci.getQuantity())));
            orderItems.add(oi);

            productRepo.save(p);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order saved = orderRepo.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepo.save(cart);

        return saved;
    }

    public List<Order> getOrdersByUserEmail(String email){
        return orderRepo.findByUserEmail(email);
    }
}
