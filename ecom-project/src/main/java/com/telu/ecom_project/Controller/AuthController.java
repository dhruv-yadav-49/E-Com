package com.telu.ecom_project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.telu.ecom_project.dto.AuthResponse;
import com.telu.ecom_project.dto.LoginRequest;
import com.telu.ecom_project.dto.RegisterRequest;
import com.telu.ecom_project.repo.UserRepo;
import com.telu.ecom_project.response.ApiResponse;
import com.telu.ecom_project.service.VerificationTokenService;
import com.telu.ecom_project.serviceInterface.IUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private IUserService userService;

    @Autowired
    private VerificationTokenService verificationTokenService;

    @Autowired
    private UserRepo userRepo;

    /**
     * Register a new user.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse<AuthResponse> response = userService.register(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    /**
     * Login with email and password. Returns JWT tokens.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = userService.login(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    /**
     * Verify user email using the token sent in the verification link.
     * GET /api/auth/verify-email?token=<token>
     */
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        return verificationTokenService.validateAndExtractEmail(token)
                .map(email -> userRepo.findByEmail(email)
                        .map(user -> {
                            if (user.getIsEmailVerified()) {
                                return ResponseEntity.ok("Email already verified.");
                            }
                            user.setIsEmailVerified(true);
                            userRepo.save(user);
                            return ResponseEntity.ok("Email verified successfully! You can now login.");
                        })
                        .orElse(ResponseEntity.badRequest().body("User not found.")))
                .orElse(ResponseEntity.badRequest().body("Invalid or expired verification token."));
    }
}
