package com.telu.ecom_project.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.repo.CategoryRepo;

@Service
@SuppressWarnings("null")
public class CategoryService {

    @Autowired
    private CategoryRepo repo;

    @Autowired
    private S3Service s3Service;

    // ── Create with optional image ──────────────────────────────
    public Category createCategory(String name, String description, MultipartFile image) throws IOException {

        if (repo.findByName(name).isPresent()) {
            throw new RuntimeException("Category already exists: " + name);
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = s3Service.uploadFile(image);
        }

        Category cat = new Category();
        cat.setName(name);
        cat.setDescription(description);
        cat.setImageUrl(imageUrl);

        return repo.save(cat);
    }

    // ── Get all ─────────────────────────────────────────────────
    public List<Category> getAllCategories() {
        return repo.findAll();
    }

    // ── Get by ID ───────────────────────────────────────────────
    public Category getCategoryById(int id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    // ── Update with optional image ──────────────────────────────
    public Category updateCategory(int id, String name, String description, MultipartFile image) throws IOException {

        Category existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));

        if (name != null && !name.isBlank()) {
            existing.setName(name);
        }
        if (description != null && !description.isBlank()) {
            existing.setDescription(description);
        }
        if (image != null && !image.isEmpty()) {
            // Delete old image from S3 if it exists
            if (existing.getImageUrl() != null) {
                try { s3Service.deleteFile(existing.getImageUrl()); } catch (Exception ignored) {}
            }
            existing.setImageUrl(s3Service.uploadFile(image));
        }

        return repo.save(existing);
    }

    // ── Delete ───────────────────────────────────────────────────
    public String deleteCategory(int id) {

        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));

        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            return "Cannot delete: " + category.getProducts().size() + " product(s) exist in this category";
        }

        // Delete image from S3
        if (category.getImageUrl() != null) {
            try { s3Service.deleteFile(category.getImageUrl()); } catch (Exception ignored) {}
        }

        repo.deleteById(id);
        return "Category '" + category.getName() + "' deleted successfully";
    }
}
