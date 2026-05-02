package com.telu.ecom_project.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Wishlist {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String userEmail;

    @ManyToMany
    @JoinTable(
        name = "wishlist_products",
        joinColumns = @JoinColumn(name = "wishlist_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Product> products;

}
