package sgc.condominio.modules.morador.repository;

import sgc.condominio.modules.morador.model.Morador;
import sgc.condominio.modules.morador.model.StatusMorador;
import sgc.condominio.modules.morador.model.TipoMorador;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MoradorRepository extends JpaRepository<Morador, Long> {

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    java.util.Optional<Morador> findByEmail(String email);

    @Query("SELECT m FROM Morador m WHERE m.tipoMorador IN :tipos AND m.status IN :statusList AND m.dataSaida IS NULL")
    List<Morador> findResponsaveisFinanceirosAtivos(
            @Param("tipos") List<TipoMorador> tipos,
            @Param("statusList") List<StatusMorador> statusList
    );
}
