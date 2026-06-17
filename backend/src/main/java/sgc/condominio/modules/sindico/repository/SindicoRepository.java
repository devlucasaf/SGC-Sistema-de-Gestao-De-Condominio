package sgc.condominio.modules.sindico.repository;

import sgc.condominio.modules.sindico.model.Sindico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SindicoRepository extends JpaRepository<Sindico, Long> {
    Optional<Sindico> findByStatus(String status);
}
