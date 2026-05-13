package com.telu.ecom_project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        exposeDirectory("uploads", registry);
    }

    private void exposeDirectory(String dirName, ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(dirName);
        String uploadPath = uploadDir.toFile().getAbsolutePath();
        
        // Ensure the path ends with a separator
        if (!uploadPath.endsWith("/") && !uploadPath.endsWith("\\")) {
            uploadPath += "/";
        }
        
        // Fix for Windows file path format
        String location = "file:///" + uploadPath.replace("\\", "/");

        registry.addResourceHandler("/" + dirName + "/**")
                .addResourceLocations(location);
                
        System.out.println("WebMvcConfig: Exposing /" + dirName + "/** to " + location);
    }
}
