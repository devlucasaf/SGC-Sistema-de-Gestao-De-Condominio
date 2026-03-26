package com.condominio.modules.reclamacao.repository;

import com.condominio.modules.reclamacao.model.Reclamacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamacaoRepository extends JpaRepository<Reclamacao, Long> {
    List<Reclamacao> findByUnidade(String unidade);
}