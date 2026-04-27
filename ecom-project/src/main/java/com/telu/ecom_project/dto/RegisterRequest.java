package com.telu.ecom_project.dto;

import java.time.LocalDate;


import lombok.Data;
@Data
public class RegisterRequest {
	private String email;
	private String password;
	private String fullName;
	private String phoneNumber;
	private String profilePictureUrl;
	private LocalDate dateOfBirth;
	private String address;
}
