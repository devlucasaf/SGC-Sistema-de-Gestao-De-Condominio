package com.condominio.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import com.condominio.modules.morador.model.Morador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    // --- Gerar TOKEN
    public String gerarToken(Morador morador) {
        try {
            // Define o algoritmo de criptografia
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("SGC-API") // Quem emitiu o token
                    .withSubject(morador.getEmail()) // Dono do token
                    .withClaim("id", morador.getId()) // Guardamos o ID dele
                    .withExpiresAt(dataExpiracao()) // Validade do token
                    .sign(algoritmo); // Assina digitalmente
        }
        catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String getSubject(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("SGC-API")
                    .build()
                    .verify(tokenJWT) // Tenta ler o token
                    .getSubject(); // Pega o email que estava guardado lá dentro
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
