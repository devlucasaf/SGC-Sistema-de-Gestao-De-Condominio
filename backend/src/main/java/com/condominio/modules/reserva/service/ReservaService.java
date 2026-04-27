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
import java.util.stream.Collectors;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private AreaLazerRepository areaLazerRepository;

    // --- RESERVAR ESPAÇO COM VALIDAÇÃO DE CONFLITO DE HORÁRIO ---
    @Transactional
    public ReservaResponseDTO reservar(ReservaRequestDTO dto, Morador moradorLogado) {

        // --- VERIFICA SE A ÁREA DE LAZER EXISTE ---
        AreaLazer area = areaLazerRepository.findById(dto.getIdAreaLazer())
                .orElseThrow(() -> new RuntimeException("Área de lazer não encontrada"));

        // --- VALIDA QUE HORA FIM É APÓS HORA INÍCIO ---
        if (dto.getHoraFim().isBefore(dto.getHoraInicio()) || dto.getHoraFim().equals(dto.getHoraInicio())) {
            throw new RuntimeException("O horário de término deve ser após o horário de início.");
        }

        // --- VERIFICA CONFLITO DE HORÁRIO ---
        List<Reserva> conflitos = reservaRepository.findConflitosHorario(
                dto.getIdAreaLazer(),
                dto.getDataReserva(),
                dto.getHoraInicio(),
                dto.getHoraFim()
        );

        if (!conflitos.isEmpty()) {
            throw new RuntimeException("Esta área já possui reserva neste horário. Escolha outro horário.");
        }

        // --- CRIA A RESERVA ---
        Reserva reserva = new Reserva();

        reserva.setAreaLazer(area);
        reserva.setMorador(moradorLogado);
        reserva.setDataReserva(dto.getDataReserva());
        reserva.setHoraInicio(dto.getHoraInicio());
        reserva.setHoraFim(dto.getHoraFim());
        reserva.setStatus(StatusReserva.APROVADA);

        Reserva reservaSalva = reservaRepository.save(reserva);

        return converterParaDTO(reservaSalva);
    }

    // --- CANCELAR RESERVA ---
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

    // --- BUSCAR RESERVAS DO MORADOR ---
    public List<ReservaResponseDTO> buscarPorMorador(Long idMorador) {
        List<Reserva> reservas = reservaRepository.findByMoradorIdOrderByDataReservaDesc(idMorador);

        return reservas.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // --- LISTAR TODAS PARA PORTEIRO ---
    @Transactional(readOnly = true)
    public List<ReservaPorteiroDTO> listarTodasParaPorteiro() {
        return reservaRepository.findAllByOrderByDataReservaDesc()
                .stream()
                .map(ReservaPorteiroDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --- BUSCAR RESERVAS OCUPADAS POR ÁREA (PARA CALENDÁRIO) ---
    public List<ReservaResponseDTO> buscarOcupadasPorArea(Long idArea) {
        return reservaRepository.findByAreaLazerIdAndStatusNotCancelada(idArea)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // --- CONVERTER ENTIDADE PARA DTO ---
    private ReservaResponseDTO converterParaDTO(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();

        dto.setId(reserva.getId());
        dto.setNomeAreaLazer(reserva.getAreaLazer().getNome());
        dto.setValorAreaLazer(reserva.getAreaLazer().getValor());
        dto.setDataReserva(reserva.getDataReserva());
        dto.setHoraInicio(reserva.getHoraInicio());
        dto.setHoraFim(reserva.getHoraFim());
        dto.setStatus(reserva.getStatus());

        return dto;
    }
}