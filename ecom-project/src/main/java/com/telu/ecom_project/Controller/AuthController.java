package com.telu.ecom_project.Controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import com.telu.ecom_project.service.EmailService;
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
                .map(email -> (ResponseEntity<String>) userRepo.findByEmail(email)
                        .map(user -> {
                            if (user.getIsEmailVerified()) {
                                return ResponseEntity.ok("Email already verified.");
                            }
                            user.setIsEmailVerified(true);
                            userRepo.save(user);
                            return ResponseEntity.<String>ok("Email verified successfully! You can now login.");
                        })
                        .orElseGet(() -> ResponseEntity.badRequest().body("User not found.")))
                .orElseGet(() -> ResponseEntity.badRequest().body("Invalid or expired verification token."));
    }

    /**
     * Send password reset link to user's email.
     * POST /api/auth/forgot-password
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return userRepo.findByEmail(email)
            .map(user -> {
                String token = UUID.randomUUID().toString();
                user.setPasswordResetToken(token);
                user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
                userRepo.save(user);

                String link = "http://localhost:5173/reset-password?token=" + token;
                emailService.sendEmail(
                    user.getEmail(),
                    "Reset Password \uD83D\uDD10",
                    "Click here to reset your password:\n" + link
                );

                return ResponseEntity.<ApiResponse<String>>ok(
                    new ApiResponse<>(200, "Password reset link sent to " + email, null)
                );
            })
            .orElseGet(() -> ResponseEntity.badRequest()
                .body(new ApiResponse<>(400, "No account found with email: " + email, null)));
    }

    /**
     * Reset password using the token from email.
     * POST /api/auth/reset-password
     * Body: { "token": "...", "newPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody Map<String, String> body) {
        String token       = body.get("token");
        String newPassword = body.get("newPassword");

        var userOpt = userRepo.findByPasswordResetToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(400, "Invalid or expired reset token.", null));
        }

        var user = userOpt.get();
        if (user.getPasswordResetTokenExpiry() == null ||
            user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(400, "Reset token has expired. Please request a new one.", null));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepo.save(user);

        return ResponseEntity.ok(new ApiResponse<>(200, "Password reset successfully!", null));
    }
}
