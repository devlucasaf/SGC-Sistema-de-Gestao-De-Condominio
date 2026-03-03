package com.condominio.modules.unidade.repository;

import com.condominio.modules.unidade.model.Unidade;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {
    @Override
    Optional<Unidade> findById(Long aLong);

    boolean existsByIdUnidade(Long idUnidade);
}
