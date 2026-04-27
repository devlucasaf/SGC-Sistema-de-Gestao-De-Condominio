package com.condominio.modules.manutencao.repository;

// --- IMPORTAÇÕES ---
import com.condominio.modules.manutencao.model.Manutencao;
import com.condominio.modules.manutencao.model.StatusManutencao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// --- REPOSITORY DE MANUTENÇÃO ---
public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    // --- LISTAR TODAS ORDENADAS POR DATA DE INÍCIO ---
    List<Manutencao> findAllByOrderByDataInicioDesc();

    // --- LISTAR PRÓXIMAS (AGENDADAS E EM ANDAMENTO) ---
    List<Manutencao> findByStatusInOrderByDataInicioAsc(List<StatusManutencao> status);
}

