package sgc.condominio.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import sgc.condominio.modules.usuario.model.Usuario;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    // --- GERAR TOKEN ---
    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("SGC-API")
                    .withSubject(usuario.getEmail())
                    .withClaim("id", usuario.getId())
                    .withClaim("tipoUsuario", usuario.getTipoUsuario().name())
                    .withClaim("type", "access")
                    .withExpiresAt(dataExpiracao())
                    .sign(algoritmo);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    // --- GERAR REFRESH TOKEN ---
    public String gerarRefreshToken(Usuario usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("SGC-API")
                    .withSubject(usuario.getEmail())
                    .withClaim("id", usuario.getId())
                    .withClaim("type", "refresh")
                    .withExpiresAt(dataExpiracaoRefresh())
                    .sign(algoritmo);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar refresh token", exception);
        }
    }

    // --- LER TOKEN ---
    public String getSubject(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("SGC-API")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    // --- EXTRAIR O TIPO DO TOKEN ---
    public String getTokenType(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            DecodedJWT decoded = JWT.require(algoritmo)
                    .withIssuer("SGC-API")
                    .build()
                    .verify(tokenJWT);
            return decoded.getClaim("type").asString();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    // --- EXPIRAÇÃO DO ACCESS TOKEN ---
    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    // --- EXPIRAÇÃO DO REFRESH TOKEN ---
    private Instant dataExpiracaoRefresh() {
        return LocalDateTime.now().plusDays(7).toInstant(ZoneOffset.of("-03:00"));
    }
}