package sgc.condominio.infra.security;

import sgc.condominio.modules.usuario.repository.UsuarioRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private static final Logger log = LoggerFactory.getLogger(SecurityFilter.class);

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // --- PEGA O TOKEN DO CABEÇALHO ---
        var token = recuperarToken(request);

        if (token != null) {
            try {
                // --- REJEITAR REFRESH TOKEN USADO COMO ACCESS TOKEN ---
                String tokenType = tokenService.getTokenType(token);
                if ("refresh".equals(tokenType)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // --- DESCOBRE O DONO DO TOKEN ---
                var subject = tokenService.getSubject(token);
                UserDetails usuario = repository.findByEmail(subject).orElse(null);

                if (usuario != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // --- TOKEN INVÁLIDO OU EXPIRADO ---
                log.debug("Token inválido ignorado: {}", e.getMessage());
            }
        }

        // --- CONTINUA O FLUXO ---
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "");
        }

        return null;
    }
}
