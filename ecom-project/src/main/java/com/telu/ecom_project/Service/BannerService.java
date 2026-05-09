package com.telu.ecom_project.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.model.Banner;
import com.telu.ecom_project.repo.BannerRepo;

@Service
public class BannerService {
    
    @Autowired
    private S3Service s3Service;

    @Autowired
    private BannerRepo bannerRepo;

    public Banner createBanner(String title, String subtitle, MultipartFile image, String buttonText, String buttonUrl, LocalDate validUntil){

        String imageUrl = "";
        try {
            imageUrl = s3Service.uploadFile(image);
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
}
