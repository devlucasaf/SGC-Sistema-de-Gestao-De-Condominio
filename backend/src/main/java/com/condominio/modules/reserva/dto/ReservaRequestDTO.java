package com.condominio.modules.reserva.dto;

import lombok.Data;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;

import java.time.LocalDate;

@Data
public class ReservaRequestDTO {

    @NotNull(message = "Informe a área de lazer")
    private Long idAreaLazer;

    @NotNull(message = "Informe a data da reserva")
    @Future(message = "A data da reserva deve ser no futuro")
    private LocalDate dataReserva;
}
