package com.condominio.modules.votacao.repository;

import com.condominio.modules.votacao.model.StatusVotacao;
import com.condominio.modules.votacao.model.Votacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VotacaoRepository extends JpaRepository<Votacao, Long> {
    List<Votacao> findByStatusOrderByDataCriacaoDesc(StatusVotacao status);
    List<Votacao> findAllByOrderByDataCriacaoDesc();
}

