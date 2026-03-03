package com.condominio.modules.visitante.repository;

import com.condominio.modules.visitante.model.RegistrarAcesso;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrarAcessoRepository extends JpaRepository<RegistrarAcesso, Long> {
    List<RegistrarAcesso> findByDataHoraSaidaIsNull();
}
