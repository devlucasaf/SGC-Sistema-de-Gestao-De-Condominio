package sgc.condominio.modules.manutencao.repository;

import sgc.condominio.modules.manutencao.model.Manutencao;
import sgc.condominio.modules.manutencao.model.StatusManutencao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    // --- LISTAR TODAS ORDENADAS POR DATA DE INÍCIO ---
    List<Manutencao> findAllByOrderByDataInicioDesc();

    // --- LISTAR PRÓXIMAS (AGENDADAS E EM ANDAMENTO) ---
    List<Manutencao> findByStatusInOrderByDataInicioAsc(List<StatusManutencao> status);
}

