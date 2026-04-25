package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Cart;

@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {

    Cart findByUserEmail(String email);
}