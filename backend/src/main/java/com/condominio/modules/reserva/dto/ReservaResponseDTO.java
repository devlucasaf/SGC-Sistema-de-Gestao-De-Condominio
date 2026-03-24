package com.condominio.modules.reserva.dto;

import com.condominio.modules.reserva.model.StatusReserva;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservaResponseDTO {
    private Long                id;
    private String              nomeAreaLazer;
    private Double              valorAreaLazer;
    private LocalDate           dataReserva;
    private StatusReserva       status;
}
