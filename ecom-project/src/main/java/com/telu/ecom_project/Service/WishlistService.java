package com.telu.ecom_project.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.model.Wishlist;
import com.telu.ecom_project.repo.ProductRepo;
import com.telu.ecom_project.repo.WishlistRepo;

@Service
@Transactional
public class WishlistService {
    
    @Autowired
    private CartService cartService;

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private ProductRepo productRepo;

    public Wishlist addToWishlist(String userEmail, int productId){
        
        Wishlist wishlist = wishlistRepo.findByUserEmail(userEmail);

        if(wishlist == null){
            wishlist = new Wishlist();
            wishlist.setUserEmail(userEmail);
            wishlist.setProducts(new ArrayList<>());
        }

        Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not found!"));

        if(!wishlist.getProducts().contains(product)){
            wishlist.getProducts().add(product);
            return wishlistRepo.save(wishlist);
        }else{
            throw new RuntimeException("Product already in wishlist");
        }

    }

    public Wishlist gettWishlist(String userEmail){
        return wishlistRepo.findByUserEmail(userEmail);
    }

    public Wishlist removeFromWishlist(String userEmail, int productId){

        Wishlist wishlist = wishlistRepo.findByUserEmail(userEmail);

        if(wishlist == null) throw new RuntimeException("Wishlist not found");

        Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not found!"));

        if(wishlist.getProducts().remove(product)){
            return wishlistRepo.save(wishlist);
        }
        else{
            throw new RuntimeException("Product not found in wishlist!");
        }
    }

    public Wishlist clearWishlist(String userEmail){

        Wishlist wishlist = wishlistRepo.findByUserEmail(userEmail);

        if(wishlist == null) throw new RuntimeException("Wishlist not found");

        wishlist.getProducts().clear();
        return wishlistRepo.save(wishlist);
    }

    public int countWishlist(String userEmail){

        Wishlist wishlist = wishlistRepo.findByUserEmail(userEmail);

        if(wishlist == null) return 0;

        return wishlist.getProducts().size();
    }

    @Transactional
    public String moveToCart(String email, int productId){

        Wishlist wishlist = wishlistRepo.findByUserEmail(email);

        if(wishlist == null) throw new RuntimeException("Wishlist not found");

        boolean exists = wishlist.getProducts().stream().anyMatch(p -> p.getId().equals(Integer.valueOf(productId)));

        if(!exists) throw new RuntimeException("Product not in wishlist");

        cartService.addProductToCart(email, productId, 1);

        wishlist.getProducts().removeIf(p -> p.getId().equals(Integer.valueOf(productId)));

        wishlistRepo.save(wishlist);

        return "Product moved to cart successfully!";
    }
}
