package com.telu.ecom_project.repo;

import com.telu.ecom_project.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    @Query("SELECT p from Product p WHERE "+
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(String keyword);
    Page<Product> findByCategoryId(Integer categoryId, Pageable pageable);
    Page<Product> findByCategoryName(String categoryName, Pageable pageable);
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Page<Product> findByProductAvailable(Boolean productAvailable, Pageable pageable);
    
    List<Product> findByCategoryId(Integer categoryId);
    
    @org.springframework.transaction.annotation.Transactional
    void deleteByCategoryId(Integer categoryId);

}
