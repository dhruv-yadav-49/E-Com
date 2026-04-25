package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.CartItem;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {
}
