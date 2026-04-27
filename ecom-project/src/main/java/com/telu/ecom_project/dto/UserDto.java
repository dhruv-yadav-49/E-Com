package com.telu.ecom_project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


import com.telu.ecom_project.model.UserType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserDto {
	private Long id;
	private String email;
	private String fullName;
	private String phoneNumber;
	private UserType userType;
	private String profilePictureUrl;
	private LocalDate dateOfBirth;
	private String address;
	private Boolean isActive;
	private Boolean isEmailVerified;
	private Boolean isPhoneVerified;
	private LocalDateTime lastLogin;
	private LocalDateTime createdAt;
}

