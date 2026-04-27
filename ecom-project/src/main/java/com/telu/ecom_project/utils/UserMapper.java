package com.telu.ecom_project.utils;

import java.util.List;

import com.telu.ecom_project.dto.RegisterRequest;
import com.telu.ecom_project.dto.UserDto;
import com.telu.ecom_project.dto.UserResponse;
import com.telu.ecom_project.model.User;

public class UserMapper {
	
	public static UserDto mapUserEntityToUserDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setUserType(user.getUserType());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAddress(user.getAddress());
        dto.setIsActive(user.getIsActive());
        dto.setIsEmailVerified(user.getIsEmailVerified());
        dto.setIsPhoneVerified(user.getIsPhoneVerified());
        dto.setLastLogin(user.getLastLogin());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
	 public static User mapUserDtoToUserEntity(UserDto dto) {
	        if (dto == null) return null;

	        User user = new User();
	        user.setEmail(dto.getEmail());
	        user.setFullName(dto.getFullName());
	        user.setPhoneNumber(dto.getPhoneNumber());
	        user.setUserType(dto.getUserType());
	        user.setProfilePictureUrl(dto.getProfilePictureUrl());
	        user.setDateOfBirth(dto.getDateOfBirth());
	        user.setAddress(dto.getAddress());
	        user.setIsActive(dto.getIsActive());
	        user.setIsEmailVerified(dto.getIsEmailVerified());
	        user.setIsPhoneVerified(dto.getIsPhoneVerified());
	        user.setLastLogin(dto.getLastLogin());
	        return user;
	    }
	 public static User mapRegisterRequestToUserEntity(RegisterRequest request) {
	        if (request == null) return null;

	        return User.builder()
	                .email(request.getEmail())
	                .fullName(request.getFullName())
	                .phoneNumber(request.getPhoneNumber())
	                
	                .profilePictureUrl(request.getProfilePictureUrl())
	                .dateOfBirth(request.getDateOfBirth())
	                .address(request.getAddress())
	                .build();
	    }
	 
	     public static UserResponse mapUserToUserResponse(User user) {
	    	 
	    	 UserResponse userResponse= new UserResponse();
	    	 
	    	 userResponse.setId(user.getId());
	    	 userResponse.setFullName(user.getFullName());
	    	 userResponse.setEmail(user.getEmail());
	    	 userResponse.setPhone(user.getPhoneNumber());
	    	 userResponse.setEmailVerified(user.getIsEmailVerified());
	    	 userResponse.setPhoneVerified(user.getIsPhoneVerified());
	    	 userResponse.setUserType(user.getUserType());
	    	 userResponse.setAddress(user.getAddress());
	    	 
	    	 return userResponse;
	     }
	     public static List<UserResponse> mapUsersToUserResponses(List<User> users) {
	    	    return users.stream()
	    	            .map(UserMapper::mapUserToUserResponse)
	    	            .toList();
	    	}

}

