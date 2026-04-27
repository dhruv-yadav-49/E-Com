package com.telu.ecom_project.dto;
import lombok.Data;
import com.telu.ecom_project.model.UserType;

@Data
public class UserResponse {
 
	private Long id;
	private String fullName;
	private String email;
	private String phone;
	private boolean emailVerified;
	private boolean phoneVerified;
	private UserType userType;
	private String address;
}