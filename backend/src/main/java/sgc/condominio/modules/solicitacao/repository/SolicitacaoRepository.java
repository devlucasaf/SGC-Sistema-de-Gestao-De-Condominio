package sgc.condominio.modules.solicitacao.repository;

import sgc.condominio.modules.solicitacao.model.Solicitacao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    Page<Solicitacao> findByMoradorIdOrderByDataCriacaoDesc(Long moradorId, Pageable pageable);

    List<Solicitacao> findByMoradorIdOrderByDataCriacaoDesc(Long moradorId);

    Page<Solicitacao> findByUnidadeOrderByDataCriacaoDesc(String unidade, Pageable pageable);
}

