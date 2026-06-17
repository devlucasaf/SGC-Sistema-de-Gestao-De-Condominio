package sgc.condominio.modules.visitante.repository;

import sgc.condominio.modules.visitante.model.Visitante;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {
    Optional<Visitante> findByCpf(String cpf);
}
