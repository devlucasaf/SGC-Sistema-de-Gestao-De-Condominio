package com.condominio.modules.reserva.repository;

import com.condominio.modules.reserva.model.Reserva;
import com.condominio.modules.reserva.model.StatusReserva;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    Optional<Reserva> findByAreaLazerIdAndDataReservaAndStatusNot(Long areaLazerId, LocalDate data, StatusReserva status);

    List<Reserva> findByMoradorIdOrderByDataReservaDesc(Long idMorador);
}