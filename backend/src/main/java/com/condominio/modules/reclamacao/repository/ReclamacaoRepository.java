package com.condominio.modules.reclamacao.repository;

import com.condominio.modules.reclamacao.model.Reclamacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReclamacaoRepository extends JpaRepository<Reclamacao, Long> {
}