package com.telu.ecom_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Address;
import com.telu.ecom_project.repo.AddressRepo;

@Service
@SuppressWarnings("null")
public class AddressService {

    @Autowired
    private AddressRepo addressRepo;

    public Address saveAddress(String email, Address address) {
        address.setUserEmail(email);

        List<Address> existing = addressRepo.findByUserEmail(email);
        
        // If it's the first address, make it default
        if (existing.isEmpty()) {
            address.setDefault(true);
        } else if (address.isDefault()) {
            // If setting this as default, unset others
            for (Address addr : existing) {
                addr.setDefault(false);
            }
            addressRepo.saveAll(existing);
        }

        return addressRepo.save(address);
    }

    public List<Address> getUserAddresses(String email) {
        return addressRepo.findByUserEmail(email);
    }

    public void deleteAddress(Long id, String email) {
        Address addr = addressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        if (!addr.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        
        addressRepo.deleteById(id);
    }
}
