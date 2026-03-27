package com.condominio.modules.encomenda.repository;

import com.condominio.modules.encomenda.model.Encomenda;
import com.condominio.modules.encomenda.model.StatusEncomenda;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EncomendaRepository extends JpaRepository<Encomenda, Long> {

    // --- BUSCA TODAS AS ENCOMENDAS DE UMA UNIDADE ---
    Page<Encomenda> findByUnidadeId(Long idUnidade, Pageable pageable);

    // --- BUSCA APENAS AS ENCOMENDAS QUE ESTÃO PENDENTES DE RETIRADA ---
    Page<Encomenda> findByUnidadeIdAndStatus(Long idUnidade, StatusEncomenda status, Pageable pageable);
}
