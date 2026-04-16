package com.condominio.modules.reserva.service;

import com.condominio.modules.morador.model.Morador;

import com.condominio.modules.reserva.dto.ReservaPorteiroDTO;
import com.condominio.modules.reserva.dto.ReservaRequestDTO;
import com.condominio.modules.reserva.dto.ReservaResponseDTO;
import com.condominio.modules.reserva.model.AreaLazer;
import com.condominio.modules.reserva.model.Reserva;
import com.condominio.modules.reserva.model.StatusReserva;
import com.condominio.modules.reserva.repository.AreaLazerRepository;
import com.condominio.modules.reserva.repository.ReservaRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private AreaLazerRepository areaLazerRepository;

    @Transactional
    public ReservaResponseDTO reservar(ReservaRequestDTO dto, Morador moradorLogado) {

        // --- VERIFICA SE A ÁREA DE LAZER EXISTE ---
        AreaLazer area = areaLazerRepository.findById(dto.getIdAreaLazer())
                .orElseThrow(() -> new RuntimeException("Área de lazer não encontrada"));

        // --- VERIFICA SE EXISTE RESERVA PARA A MESMA DATA E ÁREA DE LAZER ---
        Optional<Reserva> reservaExistente = reservaRepository
                .findByAreaLazerIdAndDataReservaAndStatusNot(
                        dto.getIdAreaLazer(),
                        dto.getDataReserva(),
                        StatusReserva.CANCELADA
                );

        if (reservaExistente.isPresent()) {
            throw new RuntimeException("Esta área já está reservada para a data selecionada");
        }

        // --- CRIA A RESERVA ---
        Reserva reserva = new Reserva();

        reserva.setAreaLazer(area);
        reserva.setMorador(moradorLogado);

        reserva.setDataReserva(dto.getDataReserva());

        reserva.setStatus(StatusReserva.APROVADA);

        Reserva reservaSalva = reservaRepository.save(reserva);

        return converterParaDTO(reservaSalva);
    }

    @Transactional
    public void cancelar(Long idReserva, Long idMoradorLogado) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada."));

        if (!reserva.getMorador().getId().equals(idMoradorLogado)) {
            throw new RuntimeException("Você não tem permissão para cancelar esta reserva.");
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    public List<ReservaResponseDTO> buscarPorMorador(Long idMorador) {
        List<Reserva> reservas = reservaRepository.findByMoradorIdOrderByDataReservaDesc(idMorador);

        return reservas.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaPorteiroDTO> listarTodasParaPorteiro() {
        return reservaRepository.findAllByOrderByDataReservaDesc()
                .stream()
                .map(ReservaPorteiroDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private ReservaResponseDTO converterParaDTO(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();

        dto.setId(reserva.getId());
        dto.setNomeAreaLazer(reserva.getAreaLazer().getNome());
        dto.setValorAreaLazer(reserva.getAreaLazer().getValor());
        dto.setDataReserva(reserva.getDataReserva());
        dto.setStatus(reserva.getStatus());

        return dto;
    }
}