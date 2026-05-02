package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Wishlist;

@Repository
public interface WishlistRepo extends JpaRepository<Wishlist, Integer> {

    Wishlist findByUserEmail(String userEmail);
}