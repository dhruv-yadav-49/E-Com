package com.telu.ecom_project.Controller;

import java.util.List;
import org.springframework.data.domain.Page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

import com.telu.ecom_project.model.Product;
import com.telu.ecom_project.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api")
public class ProductController {
    
    @Autowired
    private ProductService service;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable int id){

        Product product = service.getProductById(id);

        if(product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(
            @RequestParam("product") String productJson,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("categoryId") int categoryId) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);

            return ResponseEntity.ok(service.addProduct(product, imageFile, categoryId));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){
        List<Product> products = service.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/page")
    public ResponseEntity<Page<Product>> getProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy
    ){
        return ResponseEntity.ok(service.getProducts(page, size, sortBy));
    }

    @GetMapping("/products/category")
    public ResponseEntity<Page<Product>> getProductsByCategory(
        @RequestParam String category,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy
    ){
        return ResponseEntity.ok(service.getProductsByCategory(category, page, size, sortBy));
    }

    @PostMapping("/products/{id}/buy")
    public ResponseEntity<String> buyProduct(@PathVariable int id, @RequestParam int quantity){
        return ResponseEntity.ok(service.reduceStock(id, quantity));
    }


    @PostMapping("/products/{id}/apply-discount")
    public ResponseEntity<?> applyDiscount(
        @PathVariable int id,
        @RequestParam(required = false) Double percentage,
        @RequestParam(required = false) BigDecimal amount){

            Product product = service.applyDiscountByProductId(id, percentage, amount);
            
            if(product != null)
                return ResponseEntity.ok(product);
            else
                return ResponseEntity.badRequest().body("Product not found");
        }

    @PostMapping("/products/{id}/remove-discount")
    public ResponseEntity<?> removeDiscount(@PathVariable int id){
        service.removeDiscount(id);
        return ResponseEntity.ok("Discount removed");
    }

}
