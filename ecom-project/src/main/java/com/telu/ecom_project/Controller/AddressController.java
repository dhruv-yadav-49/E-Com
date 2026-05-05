package com.telu.ecom_project.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.model.Address;
import com.telu.ecom_project.service.AddressService;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<Address> saveAddress(@RequestBody Address address, Authentication auth) {
        return ResponseEntity.ok(addressService.saveAddress(auth.getName(), address));
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(Authentication auth) {
        return ResponseEntity.ok(addressService.getUserAddresses(auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long id, Authentication auth) {
        addressService.deleteAddress(id, auth.getName());
        return ResponseEntity.ok("Address deleted successfully");
    }
}
