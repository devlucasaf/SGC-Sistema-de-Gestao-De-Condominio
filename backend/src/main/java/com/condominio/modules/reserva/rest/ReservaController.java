package com.condominio.modules.reserva.rest;

import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.usuario.model.Usuario;

import com.condominio.modules.reserva.dto.ReservaRequestDTO;
import com.condominio.modules.reserva.dto.ReservaResponseDTO;
import com.condominio.modules.reserva.dto.ReservaPorteiroDTO;
import com.condominio.modules.reserva.model.AreaLazer;
import com.condominio.modules.reserva.repository.AreaLazerRepository;
import com.condominio.modules.reserva.repository.ReservaRepository;
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

    @Autowired
    private AreaLazerRepository areaLazerRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    // --- LISTAR TODAS AS RESERVAS (VISÃO PORTEIRO/SÍNDICO) ---
    @GetMapping("/todas")
    public ResponseEntity<List<ReservaPorteiroDTO>> listarTodas() {
        List<ReservaPorteiroDTO> lista = reservaService.listarTodasParaPorteiro();
        return ResponseEntity.ok(lista);
    }

    // --- EXTRAI O MORADOR LOGADO COM VALIDAÇÃO DE TIPO ---
    private Morador extrairMorador(Usuario usuario) {
        if (!(usuario instanceof Morador)) {
            throw new RuntimeException("Apenas moradores podem acessar o módulo de reservas.");
        }
        return (Morador) usuario;
    }

    // --- LISTAR TODAS AS ÁREAS DE LAZER DISPONÍVEIS ---
    @GetMapping("/areas-lazer")
    public ResponseEntity<List<AreaLazer>> listarAreasLazer() {
        return ResponseEntity.ok(areaLazerRepository.findAll());
    }

    // --- LISTAR RESERVAS OCUPADAS POR ÁREA ---
    @GetMapping("/ocupadas")
    public ResponseEntity<List<ReservaResponseDTO>> listarOcupadas(@RequestParam Long idAreaLazer) {
        List<ReservaResponseDTO> lista = reservaService.buscarOcupadasPorArea(idAreaLazer);
        return ResponseEntity.ok(lista);
    }

    // --- ROTA POST PARA DEVOLVER O DTO ---
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> reservar(
            @RequestBody @Valid ReservaRequestDTO dto,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        Morador moradorLogado = extrairMorador(usuarioLogado);
        ReservaResponseDTO response = reservaService.reservar(dto, moradorLogado);
        return ResponseEntity.ok(response);
    }

    // --- ROTA GET PARA O REACT BUSCAR O HISTÓRICO ---
    @GetMapping("/minhas-reservas")
    public ResponseEntity<List<ReservaResponseDTO>> listarMinhasReservas(
            @AuthenticationPrincipal Usuario usuarioLogado) {

        Morador moradorLogado = extrairMorador(usuarioLogado);
        List<ReservaResponseDTO> historico = reservaService.buscarPorMorador(moradorLogado.getId());
        return ResponseEntity.ok(historico);
    }

    // --- ROTA DE CANCELAR ---
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        Morador moradorLogado = extrairMorador(usuarioLogado);
        reservaService.cancelar(id, moradorLogado.getId());
        return ResponseEntity.noContent().build();
    }
}
