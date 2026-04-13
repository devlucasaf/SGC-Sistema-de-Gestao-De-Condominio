package com.condominio.modules.reserva.dto;

import com.condominio.modules.reserva.model.Reserva;
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
public class ReservaPorteiroDTO {
    private Long            id;
    private String          nomeAreaLazer;
    private LocalDate       dataReserva;
    private StatusReserva   status;
    private String          nomeMorador;
    private String          numeroApto;
    private String          bloco;

    public static ReservaPorteiroDTO fromEntity(Reserva reserva) {
        return ReservaPorteiroDTO.builder()
                .id(reserva.getId())
                .nomeAreaLazer(reserva.getAreaLazer().getNome())
                .dataReserva(reserva.getDataReserva())
                .status(reserva.getStatus())
                .nomeMorador(reserva.getMorador().getNome())
                .numeroApto(reserva.getMorador().getUnidade().getNumeroApto())
                .bloco(reserva.getMorador().getUnidade().getBloco())
                .build();
    }
}

