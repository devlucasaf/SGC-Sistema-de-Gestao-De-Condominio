package com.condominio.modules.autenticacao.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private String refreshToken;

    public LoginResponseDTO(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
}
