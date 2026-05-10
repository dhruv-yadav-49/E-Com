package com.telu.ecom_project;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class EcomProjectApplication {

    private static final Logger logger = LoggerFactory.getLogger(EcomProjectApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(EcomProjectApplication.class, args);
        logger.info("EcomProjectApplication has started successfully!");
	}
}