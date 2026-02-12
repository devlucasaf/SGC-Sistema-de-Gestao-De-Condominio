package com.condominio.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable() // Desabilita proteção contra ataques de formulário
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Diz para não guardar sessão
                .and().authorizeRequests()
                // --- REGRAS DE ACESSO ---
                .antMatchers(HttpMethod.POST, "/auth/login").permitAll() // Login é PÚBLICO
                .antMatchers(HttpMethod.POST, "/unidades").permitAll() // Deixei público pra você cadastrar a primeira unidade
                .antMatchers(HttpMethod.POST, "/moradores").permitAll() // Deixei público pra você cadastrar o primeiro morador
                .anyRequest().authenticated() // TODO O RESTO PRECISA DE TOKEN
                .and()
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class) // Adiciona nosso filtro antes do padrão do Spring
                .build();
    }

    // Cria o objeto que gerencia a autenticação (usado no AutenticacaoController)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // Codificador de senhas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
