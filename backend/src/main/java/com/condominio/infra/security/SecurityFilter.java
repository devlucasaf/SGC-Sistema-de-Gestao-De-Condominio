package com.condominio.infra.security;

import com.condominio.modules.morador.repository.MoradorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MoradorRepository moradorRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Pega o token do cabeçalho
        var token = recuperarToken(request);

        if (token != null) {
            // Descobre quem é o dono do token
            var subject = tokenService.getSubject(token);

            // Faz a busca do usuário completo no banco
            UserDetails usuario = moradorRepository.findByEmail(subject)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

            // Cria a autenticação do Spring
            var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());

            // Salva no contexto
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continua o fluxo
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            return null;
        }

        return authHeader.replace("Beares ", "");
    }

}
