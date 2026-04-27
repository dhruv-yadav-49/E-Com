package com.telu.ecom_project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "New password is required")
    private String newPassword;
    @NotBlank(message = "Confirm password is required")
    private String ConfirmPassword;
}

