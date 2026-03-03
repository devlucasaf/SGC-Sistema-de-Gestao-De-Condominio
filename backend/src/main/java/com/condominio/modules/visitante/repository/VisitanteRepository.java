package com.condominio.modules.visitante.repository;

import com.condominio.modules.visitante.model.Visitante;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {
    Optional<Visitante> findByCpf(String cpf);
}