package com.telu.ecom_project.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.Banner;

@Repository
public interface BannerRepo extends JpaRepository<Banner, Long>{
    List<Banner> findByActiveTrueAndValidUntilAfter(LocalDate date);
}