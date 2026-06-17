package sgc.condominio.modules.reserva.repository;

import sgc.condominio.modules.reserva.model.Reserva;
import sgc.condominio.modules.reserva.model.StatusReserva;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    Optional<Reserva> findByAreaLazerIdAndDataReservaAndStatusNot(Long areaLazerId, LocalDate data, StatusReserva status);

    @Query("SELECT r FROM Reserva r WHERE r.areaLazer.id = :idArea " +
           "AND r.dataReserva = :data " +
           "AND r.status <> 'CANCELADA' " +
           "AND r.horaInicio < :horaFim " +
           "AND r.horaFim > :horaInicio")
    List<Reserva> findConflitosHorario(
            @Param("idArea") Long idArea,
            @Param("data") LocalDate data,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFim") LocalTime horaFim
    );

    @Query("SELECT r FROM Reserva r WHERE r.areaLazer.id = :idArea AND r.status <> 'CANCELADA'")
    List<Reserva> findByAreaLazerIdAndStatusNotCancelada(@Param("idArea") Long idArea);

    List<Reserva> findByMoradorIdOrderByDataReservaDesc(Long idMorador);

    List<Reserva> findAllByOrderByDataReservaDesc();
}