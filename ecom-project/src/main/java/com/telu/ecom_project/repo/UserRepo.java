package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.telu.ecom_project.model.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
}
