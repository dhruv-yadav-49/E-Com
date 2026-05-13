package com.telu.ecom_project.config;

import com.telu.ecom_project.model.Category;
import com.telu.ecom_project.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public void run(String... args) throws Exception {
        List<String> defaultCategories = Arrays.asList(
            "Electronics", "Fashion", "Mobiles", "Beauty", "Home", 
            "Appliances", "Bags", "Sports", "Books", "Bikes"
        );

        for (String catName : defaultCategories) {
            if (!categoryRepo.findByName(catName).isPresent()) {
                Category cat = new Category();
                cat.setName(catName);
                categoryRepo.save(cat);
                System.out.println("Seeded category: " + catName);
            }
        }
    }
}
