package sgc.condominio.modules.porteiro.repository;

import sgc.condominio.modules.porteiro.model.Porteiro;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PorteiroRepository extends JpaRepository<Porteiro, Long> {
    Optional<Porteiro> findByMatricula(String matricula);
}