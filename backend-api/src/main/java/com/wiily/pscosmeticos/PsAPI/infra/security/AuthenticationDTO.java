package com.wiily.pscosmeticos.PsAPI.infra.security;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(
        @NotBlank
        String username,
        @NotBlank
        String password
) {
}
