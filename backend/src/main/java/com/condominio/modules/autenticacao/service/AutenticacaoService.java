package com.condominio.modules.autenticacao.service;

import com.condominio.modules.morador.repository.MoradorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private MoradorRepository repository;

    // O Spring Security chama esse método automaticamente quando alguém tenta logar
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username == email
        return repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + username));
    }
}