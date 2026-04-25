package com.telu.ecom_project.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Cart;
import com.telu.ecom_project.model.CartItem;
import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.repo.CartItemRepo;
import com.telu.ecom_project.repo.CartRepo;
import com.telu.ecom_project.repo.ProductRepo;

import jakarta.transaction.Transactional;

@Service
public class CartService {
    
    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ProductRepo productRepo;

    public Cart getCart(String email){
        return cartRepo.findByUserEmail(email);
    }

    public List<Cart> getCarts(){
        return cartRepo.findAll();
    }

    @Transactional
    public Cart addToCart(String email, Integer productId, Integer qty){
        if (email == null || productId == null || qty == null) {
            throw new RuntimeException("Email, Product ID, and Quantity must not be null");
        }

        Cart cart = cartRepo.findByUserEmail(email);

        if(cart == null){
            cart = new Cart();
            cart.setUserEmail(email);
            cart.setItems(new ArrayList<>());
        }

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product already exists in cart
        CartItem existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
            .findFirst()
            .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + qty);
        } else {
            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(qty);
            item.setCart(cart);
            cart.getItems().add(item);
        }

        return cartRepo.save(cart);
    }

    @Transactional
    public Cart removeFromCart(Integer itemId){
        if (itemId == null) {
            throw new RuntimeException("Item ID must not be null");
        }
        CartItem item = cartItemRepo.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        Cart cart = item.getCart();
        if (cart != null) {
            if (cart.getItems() != null) {
                cart.getItems().remove(item);
            }
            cartItemRepo.delete(item);
            return cartRepo.save(cart);
        }
        
        cartItemRepo.delete(item);
        return null;
    }

    @Transactional
    public void clearCart(String email){
        Cart cart = cartRepo.findByUserEmail(email);
        if(cart != null && cart.getItems() != null){
            cart.getItems().clear();
            cartRepo.save(cart);
        }
    }
}
