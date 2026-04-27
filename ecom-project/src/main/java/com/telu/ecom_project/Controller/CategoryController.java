package com.telu.ecom_project.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.service.CategoryService;

@RestController
@RequestMapping("/api")
public class CategoryController {
    
    @Autowired
    private CategoryService service;

    @PostMapping("/category")
    public ResponseEntity<?> create(@RequestBody Category category){
        return ResponseEntity.ok(service.createCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAll(){
        return ResponseEntity.ok(service.getAllCategories());
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Category category){
        return ResponseEntity.ok(service.updateCategory(id, category));
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<String> delete(@PathVariable int id){
        return ResponseEntity.ok(service.deleteCategory(id));
    }
}
