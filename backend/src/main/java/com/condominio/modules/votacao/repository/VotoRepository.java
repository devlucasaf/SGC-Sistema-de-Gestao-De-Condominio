package com.condominio.modules.votacao.repository;

import com.condominio.modules.votacao.model.Voto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VotoRepository extends JpaRepository<Voto, Long> {
    boolean existsByVotacaoIdAndMoradorId(Long votacaoId, Long moradorId);
    List<Voto> findByVotacaoId(Long votacaoId);
    long countByVotacaoId(Long votacaoId);
}

