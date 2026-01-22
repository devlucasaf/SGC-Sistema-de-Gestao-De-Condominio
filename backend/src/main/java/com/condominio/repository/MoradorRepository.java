package com.condominio.repository;

import com.condominio.model.usuario.Morador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MoradorRepository extends JpaRepository<Morador, Long> {
    Optional<Morador> findByEmail(String email);
    boolean existsByEmail(String email);
}
