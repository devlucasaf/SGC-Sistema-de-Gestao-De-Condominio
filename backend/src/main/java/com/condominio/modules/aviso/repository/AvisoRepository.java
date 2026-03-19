package com.condominio.modules.aviso.repository;

import com.condominio.modules.aviso.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {

    List<Aviso> findAllByOrderByDataCriacaoDesc();
}
