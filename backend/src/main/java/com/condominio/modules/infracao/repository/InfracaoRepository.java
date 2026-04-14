package com.condominio.modules.infracao.repository;

import com.condominio.modules.infracao.model.Infracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfracaoRepository extends JpaRepository<Infracao, Long> {

    List<Infracao> findByMoradorIdOrderByDataCriacaoDesc(Long moradorId);

    List<Infracao> findAllByOrderByDataCriacaoDesc();
}

