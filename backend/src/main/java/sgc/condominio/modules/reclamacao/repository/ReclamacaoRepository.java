package sgc.condominio.modules.reclamacao.repository;

import sgc.condominio.modules.reclamacao.model.Reclamacao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReclamacaoRepository extends JpaRepository<Reclamacao, Long> {
    Page<Reclamacao> findByUnidade(String unidade, Pageable pageable);
}