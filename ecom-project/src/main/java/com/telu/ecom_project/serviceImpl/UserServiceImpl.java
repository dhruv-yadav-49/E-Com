package com.telu.ecom_project.serviceImpl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.telu.ecom_project.dto.AuthResponse;
import com.telu.ecom_project.dto.LoginRequest;
import com.telu.ecom_project.dto.RegisterRequest;
import com.telu.ecom_project.dto.UserResponse;
import com.telu.ecom_project.model.User;
import com.telu.ecom_project.model.UserType;
import com.telu.ecom_project.repo.UserRepo;
import com.telu.ecom_project.response.ApiResponse;
import com.telu.ecom_project.security.JwtService;
// import com.telu.ecom_project.service.VerificationTokenService;
import com.telu.ecom_project.serviceInterface.IUserService;
import com.telu.ecom_project.utils.UserMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired @Lazy
    private AuthenticationManager authenticationManager;

    private final com.telu.ecom_project.service.EmailService emailService;
    private final com.telu.ecom_project.service.VerificationTokenService verificationTokenService;

    // Simple in-memory rate limiter for login
    private final java.util.concurrent.ConcurrentHashMap<String, Integer> loginAttempts = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.concurrent.ConcurrentHashMap<String, Long> lockoutTimestamps = new java.util.concurrent.ConcurrentHashMap<>();

    @Override
    @Transactional
    @SuppressWarnings("null")
    public ApiResponse<AuthResponse> register(RegisterRequest request) {

        if (request == null)
            return new ApiResponse<>(400, "Invalid Request", null);

        if (request.getFullName() == null || request.getFullName().length() < 3) {
            return new ApiResponse<>(400, "Full name must be at least 3 characters", null);
        }

        if (request.getPhoneNumber() == null || !request.getPhoneNumber().matches("\\d{10}")) {
            return new ApiResponse<>(400, "Phone number must be exactly 10 digits", null);
        }

        String password = request.getPassword();
        if (password.length() < 8 || password.length() > 20) {
            return new ApiResponse<>(400, "Password must be 8–20 characters", null);
        }

        if (!password.matches(".*[A-Z].*") ||
                !password.matches(".*[a-z].*") ||
                !password.matches(".*\\d.*") ||
                !password.matches(".*[!@#$%^&*()].*")) {
            return new ApiResponse<>(400,
                    "Password must include uppercase, lowercase, number and special character", null);
        }

        if (request.getDateOfBirth() != null &&
                request.getDateOfBirth().isAfter(LocalDate.now())) {
            return new ApiResponse<>(400, "Date of birth cannot be in the future", null);
        }

        if (userRepo.existsByEmail(request.getEmail())) {
            return new ApiResponse<>(400, "Email already exists", null);
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
            return new ApiResponse<>(400, "Phone number already exists", null);
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .userType(UserType.USER)
                .profilePictureUrl(request.getProfilePictureUrl())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .build();

        User saved = userRepo.save(user);
        
        String token = verificationTokenService.generateEmailVerificationToken(saved.getEmail());
        String link = "http://localhost:8080/api/auth/verify-email?token=" + token;

        emailService.sendEmailVerificationLink(saved.getEmail(), link);

        AuthResponse auth = AuthResponse.builder()
                .accessToken(jwtService.generateAccessToken(saved))
                .refreshToken(jwtService.generateRefreshToken(saved))
                .tokenType("Bearer")
                .userId(saved.getId())
                .email(saved.getEmail())
                .role(saved.getUserType().name())
                .build();

        return new ApiResponse<>(200, "Registration Successful. Please verify your email.", auth);
    }

    @Override
    public ApiResponse<AuthResponse> login(LoginRequest request) {

        if (request == null)
            return new ApiResponse<>(400, "Invalid Request", null);

        String emailKey = request.getEmail().toLowerCase();
        
        // Rate Limiting Check
        if (lockoutTimestamps.containsKey(emailKey)) {
            if (System.currentTimeMillis() - lockoutTimestamps.get(emailKey) < 900000) { // 15 mins
                return new ApiResponse<>(429, "Too many failed attempts. Try again in 15 minutes.", null);
            } else {
                lockoutTimestamps.remove(emailKey);
                loginAttempts.remove(emailKey);
            }
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));
            
            // On success, reset attempts
            loginAttempts.remove(emailKey);
            lockoutTimestamps.remove(emailKey);

        } catch (BadCredentialsException ex) {
            int attempts = loginAttempts.getOrDefault(emailKey, 0) + 1;
            loginAttempts.put(emailKey, attempts);
            if (attempts >= 5) {
                lockoutTimestamps.put(emailKey, System.currentTimeMillis());
                return new ApiResponse<>(429, "Too many failed attempts. Try again in 15 minutes.", null);
            }
            return new ApiResponse<>(401, "Invalid Email or Password", null);
        }

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User Not Found"));

        if (!user.getIsActive())
            return new ApiResponse<>(403, "Account Disabled", null);

        if (!user.getIsEmailVerified()) {
             return new ApiResponse<>(403, "Please verify your email before logging in", null);
        }

        user.setLastLogin(java.time.LocalDateTime.now());
        userRepo.save(user);

        try {
            emailService.sendLoginNotification(user.getEmail(), user.getFullName());
        } catch (Exception e) {
            System.err.println("Failed to send login notification email: " + e.getMessage());
        }

        AuthResponse auth = AuthResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getUserType().name())
                .build();

        return new ApiResponse<>(200, "Login Successful", auth);
    }

    @Override
    @SuppressWarnings("null")
    public ApiResponse<UserResponse> deleteUserById(Long id) {

        if (id == null) {
            return new ApiResponse<>(400, "User ID cannot be null", null);
        }
        User user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));

        userRepo.delete(user);

        return new ApiResponse<UserResponse>(200, "User deleted Successfully", null);

    }

    @Override
    public ApiResponse<UserResponse> getUserById(Long id) {

        if (id == null) {
            return new ApiResponse<>(400, "User ID cannot be null", null);
        }
        User user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException(" user not found"));

        UserResponse response = UserMapper.mapUserToUserResponse(user);

        return new ApiResponse<UserResponse>(200, "User fetched successfully ", response);

    }

    @Override
    public ApiResponse<List<UserResponse>> getAllUsers() {

        List<User> users = userRepo.findAll();

        List<UserResponse> response = users.stream()
                .map(UserMapper::mapUserToUserResponse)
                .toList();

        return new ApiResponse<>(200, "Users fetched successfully", response);
    }

    @Override
    public ApiResponse<String> updateUserRole(Long userId, String role) {
        if (userId == null || role == null) {
            return new ApiResponse<>(400, "Invalid request", null);
        }
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            UserType newRole = UserType.valueOf(role.toUpperCase());
            user.setUserType(newRole);
            userRepo.save(user);
            return new ApiResponse<>(200, "User role updated successfully", null);
        } catch (IllegalArgumentException e) {
            return new ApiResponse<>(400, "Invalid role", null);
        }
    }

    @Override
    public ApiResponse<UserResponse> toggleUserStatus(Long userId) {
        if (userId == null) {
            return new ApiResponse<>(400, "User ID cannot be null", null);
        }
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setIsActive(!user.getIsActive());
        User saved = userRepo.save(user);

        String msg = saved.getIsActive() ? "User activated successfully" : "User deactivated successfully";
        return new ApiResponse<>(200, msg, UserMapper.mapUserToUserResponse(saved));
    }

}
