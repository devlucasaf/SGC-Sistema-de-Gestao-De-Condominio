package com.condominio.modules.financeiro.repository;

import com.condominio.modules.financeiro.model.Boleto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoletoRepository extends JpaRepository<Boleto, Long> {

    List<Boleto> findByMoradorId(Long idMorador);
    List<Boleto> findByStatus(String status);
}