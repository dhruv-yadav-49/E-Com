package com.telu.ecom_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.repo.CategoryRepo;

@Service
public class CategoryService {
    
    @Autowired 
    private CategoryRepo repo;

    public Category createCategory(Category category){

        if(repo.findByName(category.getName()).isPresent()){
            throw new RuntimeException("Category already exists");
        }

        return repo.save(category);
    }

    public List<Category> getAllCategories(){
        return repo.findAll();
    }

    public Category getCategoryById(int id){
        return repo.findById(id).orElseThrow(()-> new RuntimeException("Category not found"));
    }

    public Category updateCategory(int id, Category updated){

        Category existing = repo.findById(id).orElse(null);
        if(existing == null) return null;

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());

        return repo.save(existing);
    }

    public String deleteCategory(int id){

        Category category = repo.findById(id).orElse(null);
        if(category == null) return "Category not found";

        if(category.getProducts() != null && !category.getProducts().isEmpty()){
            return "Cannot delete: Products exist in this category";
        }

        repo.deleteById(id);
        return "Category deleted";
    }
}
