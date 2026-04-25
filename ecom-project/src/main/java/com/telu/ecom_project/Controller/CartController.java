package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.Service.CartService;
import com.telu.ecom_project.dto.CartItemRequest;
import com.telu.ecom_project.model.Cart;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {
    
    @Autowired
    private CartService cartService;

    @GetMapping("/{email}")
    public ResponseEntity<Cart> getCart(@PathVariable String email){
        return ResponseEntity.ok(cartService.getCart(email));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartItemRequest request){
        return ResponseEntity.ok(cartService.addToCart(request.getEmail(), request.getProductId(), request.getQuantity()));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Integer itemId){
        return ResponseEntity.ok(cartService.removeFromCart(itemId));
    }
}
