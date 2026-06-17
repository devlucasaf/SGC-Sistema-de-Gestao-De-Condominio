package sgc.condominio.modules.visitante.repository;

import sgc.condominio.modules.visitante.model.RegistrarAcesso;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrarAcessoRepository extends JpaRepository<RegistrarAcesso, Long> {
    List<RegistrarAcesso> findByDataHoraSaidaIsNull();
    List<RegistrarAcesso> findAllByOrderByDataHoraEntradaDesc();
}
