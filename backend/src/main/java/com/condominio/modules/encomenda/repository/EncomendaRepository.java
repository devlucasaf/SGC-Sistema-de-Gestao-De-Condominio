package com.condominio.modules.encomenda.repository;

import com.condominio.modules.encomenda.model.Encomenda;
import com.condominio.modules.encomenda.model.StatusEncomenda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncomendaRepository extends JpaRepository<Encomenda, Long> {

    // --- BUSCA TODAS AS ENCOMENDAS DE UMA UNIDADE ---
    List<Encomenda> findByUnidadeId(Long idUnidade);

    // --- BUSCA APENAS AS ENCOMENDAS QUE ESTÃO PENDENTES DE RETIRADA ---
    List<Encomenda> findByUnidadeIdAndStatus(Long idUnidade, StatusEncomenda status);
}
