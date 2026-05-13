package com.telu.ecom_project.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Banner;
import com.telu.ecom_project.service.BannerService;

@RestController
@RequestMapping("/api")
public class BannerController {
    
    @Autowired
    private BannerService service;

    @PostMapping("/admin/banners")
    public ResponseEntity<Banner> createBanner(@RequestParam String title, @RequestParam String subtitle, @RequestParam MultipartFile image, @RequestParam String buttonText, @RequestParam String buttonUrl, @RequestParam LocalDate validUntil){
        System.out.println("BannerController: Creating banner " + title);
        return ResponseEntity.ok(service.createBanner(title, subtitle, image, buttonText, buttonUrl, validUntil));
    }

    @GetMapping("/banners")
    public ResponseEntity<List<Banner>> getAllBanners(){
        return ResponseEntity.ok(service.getAllBanners());
    }

    @GetMapping("/banners/{id}")
    public ResponseEntity<Banner> getBannerById(@PathVariable Long id){
        return ResponseEntity.ok(service.getBannerById(id));
    }

    @GetMapping("/banners/active")
    public ResponseEntity<List<Banner>> getActiveBanners(){
        return ResponseEntity.ok(service.getActiveBanners());
    }

    // Explicit DELETE mapping
    @DeleteMapping("/admin/banners/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id){
        System.out.println("BannerController: DELETE request received for ID: " + id);
        service.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
    
    // Backup POST mapping for delete (if DELETE is blocked)
    @PostMapping("/admin/banners/delete/{id}")
    public ResponseEntity<Void> deleteBannerPost(@PathVariable Long id){
        System.out.println("BannerController: POST delete request received for ID: " + id);
        service.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

}
