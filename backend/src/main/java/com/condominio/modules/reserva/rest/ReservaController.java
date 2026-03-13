package com.condominio.modules.reserva.rest;

import com.condominio.modules.morador.model.Morador;

import com.condominio.modules.reserva.dto.ReservaRequestDTO;
import com.condominio.modules.reserva.dto.ReservaResponseDTO;
import com.condominio.modules.reserva.service.ReservaService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // --- ROTA POST PARA DEVOLVER O DTO ---
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> reservar(
            @RequestBody @Valid ReservaRequestDTO dto,
            @AuthenticationPrincipal Morador moradorLogado) {

        ReservaResponseDTO response = reservaService.reservar(dto, moradorLogado);
        return ResponseEntity.ok(response);
    }

    // --- ROTA GET PARA O REACT BUSCAR O HISTÓRICO ---
    @GetMapping("/minhas-reservas")
    public ResponseEntity<List<ReservaResponseDTO>> listarMinhasReservas(
            @AuthenticationPrincipal Morador moradorLogado) {

        List<ReservaResponseDTO> histórico = reservaService.buscarPorMorador(moradorLogado.getId());
        return ResponseEntity.ok(histórico);
    }

    // --- ROTA DE CANCELAR CONTINUA IGUAL ---
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal Morador moradorLogado) {

        reservaService.cancelar(id, moradorLogado.getId());
        return ResponseEntity.noContent().build();
    }
}
