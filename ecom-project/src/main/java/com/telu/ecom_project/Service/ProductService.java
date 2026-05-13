package com.telu.ecom_project.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.repo.CategoryRepo;
import com.telu.ecom_project.repo.ProductRepo;

@Service
@SuppressWarnings("null")
public class ProductService {
    
    @Autowired
    private ProductRepo repo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WaitlistService waitlistService;

    private final String uploadDir = "uploads/products/";

    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    private String saveImageLocally(MultipartFile image) throws IOException {
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = path.resolve(fileName);
        Files.copy(image.getInputStream(), filePath);
        return "http://localhost:8081/uploads/products/" + fileName;
    }

    @Transactional
    public Product addProduct(Product product, MultipartFile imagFile, int categoryId) throws IOException {

        Category category = categoryRepo.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);
        
        if (imagFile != null && !imagFile.isEmpty()) {
            product.setImageUrl(saveImageLocally(imagFile));
        }

        updateStockStatus(product);
        applyDiscount(product);

        return repo.save(product);
    }

    @Transactional
    public Product updateProduct(int id, Product product, MultipartFile imagFile) throws IOException {
        Product existingProduct = repo.findById(id).orElse(null);
        if(existingProduct == null ) return null;

        int oldStock = existingProduct.getStockQuantity();

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setProductAvailable(product.isProductAvailable());

        if (imagFile != null && !imagFile.isEmpty()) {
            existingProduct.setImageUrl(saveImageLocally(imagFile));
        }

        updateStockStatus(existingProduct);
        checkStockAlert(existingProduct);

        // Notify waitlist if restocked
        if (oldStock <= 0 && existingProduct.getStockQuantity() > 0) {
            waitlistService.notifyUsers(id, existingProduct.getName());
        }

        existingProduct.setPrice(product.getPrice());
        existingProduct.setDiscountPercentage(product.getDiscountPercentage());
        existingProduct.setDiscountAmount(product.getDiscountAmount());

        applyDiscount(existingProduct);

        return repo.save(existingProduct);
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

    @Transactional
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

    @Transactional
    public Product applyDiscountByProductId(int id, Double percentage, BigDecimal amount) {
        Product product = repo.findById(id).orElse(null);
        if (product == null) return null;
        product.setDiscountPercentage(percentage);
        product.setDiscountAmount(amount);
        applyDiscount(product);
        return repo.save(product);
    }

    @Transactional
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
            if (product.getStockQuantity() <= 5) {
                emailService.sendLowStockAlert(product.getName());
            }
        } catch (Exception e) {
            System.out.println("Email failed but API continue");
        }
    }

    @Transactional
    public void deleteProduct(int id){
        Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        repo.deleteById(id);
    }

    @Transactional
    public void deleteProducts(List<Integer> ids){
        repo.deleteAllById(ids);
    }

    @Transactional
    public void deleteAllProducts(){
        repo.deleteAll();
    }

    @Transactional
    public void deleteProductByCategoryId(int categoryId){
        repo.deleteByCategoryId(categoryId);
    }

    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, String sortBy){
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(sortBy));
        return repo.findByPriceBetween(minPrice, maxPrice, pageable).getContent();
    }

    public List<Product> getProductsByStockStatus(boolean stockStatus, String sortBy){
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(sortBy));
        return repo.findByProductAvailable(stockStatus, pageable).getContent();
    }

    public List<Product> compareProducts(List<Integer> ids) {
        return repo.findAllById(ids);
    }

    public List<Product> getSimilarProducts(int id, String sortBy, int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return repo.findByCategoryAndIdNot(product.getCategory(), product.getId(), pageable).getContent();
    }

    public Page<Product> getProductsByBrand(String brand, int page, int size, String sort){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        return repo.findByBrand(brand, pageable);
    }
}
