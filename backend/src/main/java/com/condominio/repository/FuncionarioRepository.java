package com.condominio.repository;

import com.condominio.model.usuario.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findByEmailCorporativo(String emailCorporativo);
    boolean existsByEmailCorporativo(String emailCorporativo);
}
