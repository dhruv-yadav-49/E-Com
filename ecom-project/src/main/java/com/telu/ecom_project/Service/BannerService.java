package com.telu.ecom_project.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Banner;
import com.telu.ecom_project.repo.BannerRepo;

@Service
public class BannerService {
    
    @Autowired
    private BannerRepo bannerRepo;

    private final String uploadDir = "uploads/banners/";

    @Transactional
    public Banner createBanner(String title, String subtitle, MultipartFile image, String buttonText, String buttonUrl, LocalDate validUntil){

        String imageUrl = "";
        try {
            // Create directory if not exists
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // Save file locally
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = path.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);
            
            // Access URL (Assuming we will expose /uploads/ via WebMvcConfig)
            imageUrl = "http://localhost:8081/uploads/banners/" + fileName;
            
        } catch (Exception e) {
            e.printStackTrace();
        }

        Banner banner = new Banner();
        banner.setTitle(title);
        banner.setSubtitle(subtitle);
        banner.setImageUrl(imageUrl);
        banner.setButtonText(buttonText);
        banner.setButtonUrl(buttonUrl);
        banner.setActive(true);
        banner.setValidUntil(validUntil);

        return bannerRepo.save(banner);
    }

    public List<Banner> getAllBanners() {
        return bannerRepo.findAll();
    }

    public Banner getBannerById(Long id) {
        return bannerRepo.findById(id).orElse(null);
    }

    public List<Banner> getActiveBanners() {
        return bannerRepo.findByActiveTrueAndValidUntilAfter(LocalDate.now());
    }

    @Transactional
    public void deleteBanner(Long id) {
        bannerRepo.deleteById(id);
    }
}
