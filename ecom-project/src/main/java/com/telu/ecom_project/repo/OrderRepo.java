package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {

    List<Order> findByUserEmail(String email);
}
