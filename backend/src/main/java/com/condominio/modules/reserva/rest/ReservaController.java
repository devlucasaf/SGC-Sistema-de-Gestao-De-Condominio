package com.condominio.modules.reserva.rest;

import com.condominio.modules.morador.model.Morador;

import com.condominio.modules.reserva.dto.ReservaRequestDTO;
import com.condominio.modules.reserva.model.Reserva;
import com.condominio.modules.reserva.service.ReservaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public ResponseEntity<Reserva> reservar(
            @RequestBody @Valid ReservaRequestDTO dto,
            @AuthenticationPrincipal Morador moradorLogado) {

        Reserva reserva = reservaService.reservar(dto, moradorLogado);
        return ResponseEntity.ok(reserva);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal Morador moradorLogado) {

        reservaService.cancelar(id, moradorLogado.getId());
        return ResponseEntity.noContent().build();
    }
}