package com.telu.ecom_project.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Address;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    List<Address> findByUserEmail(String userEmail);
}
