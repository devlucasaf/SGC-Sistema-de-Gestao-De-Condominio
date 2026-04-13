package com.condominio.modules.documento.repository;

import com.condominio.modules.documento.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findAllByOrderByDataCriacaoDesc();

    List<Documento> findByCategoriaOrderByDataCriacaoDesc(String categoria);
}

