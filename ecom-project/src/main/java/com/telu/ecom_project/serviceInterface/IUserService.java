package com.telu.ecom_project.serviceInterface;



import java.util.List;

import com.telu.ecom_project.dto.AuthResponse;
import com.telu.ecom_project.dto.LoginRequest;
import com.telu.ecom_project.dto.RegisterRequest;

import com.telu.ecom_project.dto.UserResponse;
import com.telu.ecom_project.response.ApiResponse;




public interface IUserService  {
	
	ApiResponse<AuthResponse> register(RegisterRequest request);
	
	
	ApiResponse<AuthResponse> login(LoginRequest request);
    
	ApiResponse<UserResponse> deleteUserById(Long id);
	
	ApiResponse<UserResponse>  getUserById(Long id);
	
	ApiResponse<List <UserResponse>> getAllUsers();
	
	ApiResponse<String> updateUserRole(Long userId, String role);

}
