package sgc.condominio.modules.financeiro.repository;

import sgc.condominio.modules.financeiro.model.Boleto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoletoRepository extends JpaRepository<Boleto, Long> {

    List<Boleto> findByMoradorId(Long idMorador);
    List<Boleto> findByStatus(String status);

    @Query("SELECT COUNT(b) > 0 FROM Boleto b WHERE b.morador.id = :idMorador AND b.descricao = :descricao")
    boolean existsByMoradorIdAndDescricao(@Param("idMorador") Long idMorador, @Param("descricao") String descricao);
}