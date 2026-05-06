package com.telu.ecom_project.Controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.telu.ecom_project.dto.UserResponse;
import com.telu.ecom_project.model.User;
import com.telu.ecom_project.repo.UserRepo;
import com.telu.ecom_project.response.ApiResponse;
import com.telu.ecom_project.service.S3Service;

@RestController
@RequestMapping("/api/user")
@SuppressWarnings("null")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private S3Service s3Service;

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication auth,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) MultipartFile profilePic) throws IOException {

        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setFullName(fullName.trim());
        }

        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            user.setPhoneNumber(phoneNumber.trim());
        }

        if (profilePic != null && !profilePic.isEmpty()) {
            if (user.getProfilePictureUrl() != null) {
                try {
                    s3Service.deleteFile(user.getProfilePictureUrl());
                } catch (Exception ignored) {}
            }
            String newPicUrl = s3Service.uploadFile(profilePic);
            user.setProfilePictureUrl(newPicUrl);
        }

        userRepo.save(user);

        UserResponse dto = com.telu.ecom_project.utils.UserMapper.mapUserToUserResponse(user);

        return ResponseEntity.ok(new ApiResponse<>(200, "Profile updated successfully", dto));
    }
}
