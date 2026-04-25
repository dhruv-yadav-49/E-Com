package com.telu.ecom_project.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.repo.CategoryRepo;
import com.telu.ecom_project.repo.ProductRepo;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepo repo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private EmailService emailService;

    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imagFile, int categoryId) throws IOException {

        Category category = categoryRepo.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);

        product.setImageName(imagFile.getOriginalFilename());
        product.setImageType(imagFile.getContentType());
        product.setImageData(imagFile.getBytes());

        updateStockStatus(product);

        applyDiscount(product);

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
        existingProduct.setImageData(imagFile.getBytes());

        updateStockStatus(existingProduct);
        checkStockAlert(existingProduct);

        existingProduct.setPrice(product.getPrice());
        existingProduct.setDiscountPercentage(product.getDiscountPercentage());
        existingProduct.setDiscountAmount(product.getDiscountAmount());

        applyDiscount(existingProduct);

        return repo.save(existingProduct);
    }
   
    public void deleteProduct(int id){
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword){
        return repo.searchProducts(keyword);
    }

    public Page<Product> getProducts(int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return repo.findAll(pageable);
    }
    
    public Page<Product> getProductsByCategory(String category, int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return repo.findByCategoryName(category, pageable);
    }

    public void updateStockStatus(Product product){

        if(product.getStockQuantity() <= 0 ){
            product.setProductAvailable(false);
            product.setLowStock(false);
        }
        else if(product.getStockQuantity() <= 5){
            product.setProductAvailable(true);
            product.setLowStock(true);
        }
        else{
            product.setProductAvailable(true);
            product.setLowStock(false);
        }
    }

    public String reduceStock(int productId, int quantity) {

        Product product = repo.findById(productId).orElse(null);

        if(product == null) return "Product not found";

        if(product.getStockQuantity() < quantity){
            return "Insufficient stock";
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);

        checkStockAlert(product);

        updateStockStatus(product);

        repo.save(product);

        return "Stock updated ✔";
    }

    public void applyDiscount(Product product){

        BigDecimal price = product.getPrice();
        if(price == null) return;

        if(product.getDiscountPercentage() != null){
            BigDecimal discountPercentage = BigDecimal.valueOf(product.getDiscountPercentage());
            BigDecimal discount = price.multiply(discountPercentage).divide(BigDecimal.valueOf(100));
            product.setFinalPrice(price.subtract(discount));
        }
        else if(product.getDiscountAmount() != null){
            product.setFinalPrice(price.subtract(product.getDiscountAmount()));
        }
        else{
            product.setFinalPrice(price);
        }
    }


    public Product applyDiscountByProductId(int id, Double percentage, BigDecimal amount) {
        Product product = repo.findById(id).orElse(null);
        if (product == null) return null;

        product.setDiscountPercentage(percentage);
        product.setDiscountAmount(amount);
        applyDiscount(product);

        return repo.save(product);
    }

    public void removeDiscount(int id){


        Product product = repo.findById(id).orElse(null);
        if(product == null) return;

        product.setDiscountPercentage(null);
        product.setDiscountAmount(null);
        product.setFinalPrice(product.getPrice());

        repo.save(product);

    }

    public void checkStockAlert(Product product) {

        try {
            if (product.getStockQuantity() == 0) {
                emailService.sendLowStockAlert(product.getName());
            }
            else if (product.getStockQuantity() < 5) {
                emailService.sendLowStockAlert(product.getName());
            }
        } catch (Exception e) {
            System.out.println("Email failed but API continue");
        }
    }
}

