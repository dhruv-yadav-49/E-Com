package com.telu.ecom_project.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.repo.ProductRepo;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imagFile) throws IOException {
        product.setImageName(imagFile.getOriginalFilename());
        product.setImageType(imagFile.getContentType());
        product.setImageDate(imagFile.getBytes());
        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imagFile) throws IOException {
        Product existingProduct = repo.findById(id).orElse(null);
        if(existingProduct == null ) return null;

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setProductAvailable(product.isProductAvailable());

        existingProduct.setImageName(imagFile.getOriginalFilename());
        existingProduct.setImageType(imagFile.getContentType());
        existingProduct.setImageDate(imagFile.getBytes());

        return repo.save(existingProduct);
    }
   
    public void deleteProduct(int id){
        repo.deleteById(id);
    }

    public List<Product> seaProducts(String keyword){
        return repo.searchProducts(keyword);
    }

    public Page<Product> getProducts(int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return repo.findAll(pageable);
    }
    
    public Page<Product> getProductsByCategory(String category, int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return repo.findByCategory(category, pageable);
    }
}

