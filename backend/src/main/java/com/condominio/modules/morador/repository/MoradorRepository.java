package com.condominio.modules.morador.repository;

import com.condominio.modules.morador.model.Morador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MoradorRepository extends JpaRepository<Morador, Long> {
    Optional<Morador> findByEmail(String email);
    boolean existsByEmail(String email);

}
