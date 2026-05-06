package com.telu.ecom_project.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.service.CategoryService;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService service;

    // 🔹 Create category with optional image  (multipart/form-data)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/category", consumes = "multipart/form-data")
    public ResponseEntity<?> create(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        return ResponseEntity.ok(service.createCategory(name, description, image));
    }

    // 🔹 Get all categories (public — both USER and ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    // 🔹 Get category by ID
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/category/{id}")
    public ResponseEntity<Category> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getCategoryById(id));
    }

    // 🔹 Update category with optional image  (multipart/form-data)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/category/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> update(
            @PathVariable int id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        return ResponseEntity.ok(service.updateCategory(id, name, description, image));
    }

    // 🔹 Delete category (also removes image from S3)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/category/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        return ResponseEntity.ok(service.deleteCategory(id));
    }
}
