package com.condominio.modules.usuario.repository;

import com.condominio.modules.usuario.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método essencial para o SecurityFilter e para o Login
    Optional<Usuario> findByEmail(String email);

    // Métodos utilitários que podem dar jeito mais à frente
    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);
}